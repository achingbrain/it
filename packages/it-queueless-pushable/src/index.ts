/**
 * @packageDocumentation
 *
 * A pushable async generator that waits until the current value is consumed
 * before allowing a new value to be pushed.
 *
 * Useful for when you don't want to keep memory usage under control and/or
 * allow a downstream consumer to dictate how fast data flows through a pipe,
 * but you want to be able to apply a transform to that data.
 *
 * @example
 *
 * ```typescript
 * import { queuelessPushable } from 'it-queueless-pushable'
 *
 * const pushable = queuelessPushable<string>()
 *
 * // run asynchronously
 * Promise.resolve().then(async () => {
 *   // push a value - the returned promise will not resolve until the value is
 *   // read from the pushable
 *   await pushable.push('hello')
 * })
 *
 * // read a value
 * const result = await pushable.next()
 * console.info(result) // { done: false, value: 'hello' }
 * ```
 */

import deferred from 'p-defer'
import { raceSignal } from 'race-signal'
import type { AbortOptions } from 'abort-error'
import type { RaceSignalOptions } from 'race-signal'

export interface Pushable<T> extends AsyncGenerator<T, void, unknown> {
  /**
   * End the iterable after all values in the buffer (if any) have been yielded. If an
   * error is passed the buffer is cleared immediately and the next iteration will
   * throw the passed error
   */
  end(err?: Error, options?: AbortOptions & RaceSignalOptions): Promise<void>

  /**
   * Push a value into the iterable. Values are yielded from the iterable in the order
   * they are pushed. Values not yet consumed from the iterable are buffered.
   */
  push(value: T, options?: AbortOptions & RaceSignalOptions): Promise<void>
}

class QueuelessPushable <T> implements Pushable<T> {
  private readNext: PromiseWithResolvers<void>
  private haveNext: PromiseWithResolvers<void>
  private ended: boolean
  private nextResult: IteratorResult<T> | undefined
  private error?: Error

  constructor () {
    this.ended = false

    this.readNext = deferred()
    this.haveNext = deferred()
  }

  [Symbol.asyncIterator] (): AsyncGenerator<T, void, unknown> {
    return this
  }

  async next (): Promise<IteratorResult<T, void>> {
    if (this.nextResult == null) {
      // wait for the supplier to push a value
      await this.haveNext.promise
    }

    if (this.nextResult == null) {
      throw new Error('HaveNext promise resolved but nextResult was undefined')
    }

    const nextResult = this.nextResult
    this.nextResult = undefined

    // signal to the supplier that we read the value
    this.readNext.resolve()
    this.readNext = deferred()

    return nextResult
  }

  async throw (err?: Error): Promise<IteratorReturnResult<undefined>> {
    this.ended = true
    this.error = err

    if (err != null) {
      // this can cause unhandled promise rejections if nothing is awaiting the
      // next value so attach a dummy catch listener to the promise
      this.haveNext.promise.catch(() => {})
      this.haveNext.reject(err)
    }

    const result: IteratorReturnResult<undefined> = {
      done: true,
      value: undefined
    }

    return result
  }

  async return (): Promise<IteratorResult<T>> {
    const result: IteratorReturnResult<undefined> = {
      done: true,
      value: undefined
    }

    this.ended = true
    this.nextResult = result

    // let the consumer know we have a new value
    this.haveNext.resolve()

    return result
  }

  async push (value: T, options?: AbortOptions & RaceSignalOptions): Promise<void> {
    await this._push(value, options)
  }

  async end (err?: Error, options?: AbortOptions & RaceSignalOptions): Promise<void> {
    if (err != null) {
      await this.throw(err)
    } else {
      // abortable return
      await this._push(undefined, options)
    }
  }

  private async _push (value?: T, options?: AbortOptions & RaceSignalOptions): Promise<void> {
    if (value != null && this.ended) {
      throw this.error ?? new Error('Cannot push value onto an ended pushable')
    }

    // wait for all values to be read
    while (this.nextResult != null) {
      await this.readNext.promise
    }

    if (value != null) {
      this.nextResult = { done: false, value }
    } else {
      this.ended = true
      this.nextResult = { done: true, value: undefined }
    }

    // let the consumer know we have a new value
    this.haveNext.resolve()
    this.haveNext = deferred()

    // wait for the consumer to have finished processing the value and requested
    // the next one or for the passed signal to abort the waiting
    await raceSignal(
      this.readNext.promise,
      options?.signal,
      options
    )
  }
}

export function queuelessPushable <T> (): Pushable<T> {
  return new QueuelessPushable<T>()
}
