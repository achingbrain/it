/**
 * @packageDocumentation
 *
 * Takes an (async) iterable that emits promise-returning functions, invokes them in parallel up to the concurrency limit and emits the results as they become available, optionally in the same order as the input
 *
 * @example
 *
 * ```javascript
 * import parallel from 'it-parallel'
 * import all from 'it-all'
 * import delay from 'delay'
 *
 * // This can also be an iterator, async iterator, generator, etc
 * const input = [
 *   async () => {
 *     console.info('start 1')
 *     await delay(500)
 *
 *     console.info('end 1')
 *     return 1
 *   },
 *   async () => {
 *     console.info('start 2')
 *     await delay(200)
 *
 *     console.info('end 2')
 *     return 2
 *   },
 *   async () => {
 *     console.info('start 3')
 *     await delay(100)
 *
 *     console.info('end 3')
 *     return 3
 *   }
 * ]
 *
 * const result = await all(parallel(input, {
 *   concurrency: 2
 * }))
 *
 * // output:
 * // start 1
 * // start 2
 * // end 2
 * // start 3
 * // end 3
 * // end 1
 *
 * console.info(result) // [2, 3, 1]
 * ```
 *
 * If order is important, pass `ordered: true` as an option:
 *
 * ```javascript
 * const result = await all(parallel(input, {
 *   concurrency: 2,
 *   ordered: true
 * }))
 *
 * // output:
 * // start 1
 * // start 2
 * // end 2
 * // start 3
 * // end 3
 * // end 1
 *
 * console.info(result) // [1, 2, 3]
 * ```
 */

import defer from 'p-defer'

interface Operation<T> {
  done: boolean
  ok: boolean
  err: Error
  value: T
}

const CustomEvent = globalThis.CustomEvent ?? Event

export interface ParallelOptions {
  /**
   * How many jobs to execute in parallel (default: )
   */
  concurrency?: number
  ordered?: boolean
}

/**
 * Takes an (async) iterator that emits promise-returning functions,
 * invokes them in parallel and emits the results as they become available but
 * in the same order as the input
 */
export default async function * parallel <T> (source: Iterable<() => Promise<T>> | AsyncIterable<() => Promise<T>>, options: ParallelOptions = {}): AsyncGenerator<T, void, undefined> {
  let concurrency = options.concurrency ?? Infinity

  if (concurrency < 1) {
    concurrency = Infinity
  }

  const ordered = options.ordered == null ? false : options.ordered
  const emitter = new EventTarget()

  const ops: Array<Operation<T>> = []
  let slotAvailable = defer()
  let resultAvailable = defer()
  let sourceFinished = false
  let sourceErr: Error | undefined
  let opErred = false

  emitter.addEventListener('task-complete', () => {
    resultAvailable.resolve()
  })

  void Promise.resolve().then(async () => {
    try {
      for await (const task of source) {
        if (ops.length === concurrency) {
          slotAvailable = defer()
          await slotAvailable.promise
        }

        if (opErred) {
          break
        }

        const op: any = {
          done: false
        }
        ops.push(op)

        task()
          .then(result => {
            op.done = true
            op.ok = true
            op.value = result
            emitter.dispatchEvent(new CustomEvent('task-complete'))
          }, err => {
            op.done = true
            op.err = err
            emitter.dispatchEvent(new CustomEvent('task-complete'))
          })
      }

      sourceFinished = true
      emitter.dispatchEvent(new CustomEvent('task-complete'))
    } catch (err: any) {
      sourceErr = err
      emitter.dispatchEvent(new CustomEvent('task-complete'))
    }
  })

  function valuesAvailable (): boolean {
    if (ordered) {
      return ops[0]?.done
    }

    return Boolean(ops.find(op => op.done))
  }

  function * yieldOrderedValues (): Generator<T, void, unknown> {
    while ((ops.length > 0) && ops[0].done) {
      const op = ops[0]
      ops.shift()

      if (op.ok) {
        yield op.value
      } else {
        // allow the source to exit
        opErred = true
        slotAvailable.resolve()

        throw op.err
      }

      slotAvailable.resolve()
    }
  }

  function * yieldUnOrderedValues (): Generator<T, void, unknown> {
    // more values can become available while we wait for `yield`
    // to return control to this function
    while (valuesAvailable()) {
      for (let i = 0; i < ops.length; i++) {
        if (ops[i].done) {
          const op = ops[i]
          ops.splice(i, 1)
          i--

          if (op.ok) {
            yield op.value
          } else {
            opErred = true
            slotAvailable.resolve()

            throw op.err
          }

          slotAvailable.resolve()
        }
      }
    }
  }

  while (true) {
    if (!valuesAvailable()) {
      resultAvailable = defer()
      await resultAvailable.promise
    }

    if (sourceErr != null) {
      // the source threw an error, propagate it
      throw sourceErr
    }

    if (ordered) {
      yield * yieldOrderedValues()
    } else {
      yield * yieldUnOrderedValues()
    }

    if (sourceFinished && ops.length === 0) {
      // not waiting for any results and no more tasks so we are done
      break
    }
  }
}
