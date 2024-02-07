import deferred, { type DeferredPromise } from 'p-defer'
import { raceSignal, type RaceSignalOptions } from 'race-signal'
import { type AbortOptions } from './index.js'

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
  private readNext: DeferredPromise<void>
  private haveNext: DeferredPromise<void>
  private ended: boolean
  private nextResult: IteratorResult<T> | undefined

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

    if (err != null) {
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

    await this._push(undefined)

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
      throw new Error('Cannot push value onto an ended pushable')
    }

    // already have a value, wait for it to be read
    if (this.nextResult != null) {
      await this.readNext.promise

      if (this.nextResult != null) {
        throw new Error('NeedNext promise resolved but nextResult was not consumed')
      }
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

export function pushable <T> (): Pushable<T> {
  return new QueuelessPushable<T>()
}
