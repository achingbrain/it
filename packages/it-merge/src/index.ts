/**
 * @packageDocumentation
 *
 * Merge several (async)iterables into one, yield values as they arrive.
 *
 * Nb. sources are iterated over in parallel so the order of emitted items is not guaranteed.
 *
 * @example
 *
 * ```javascript
 * import merge from 'it-merge'
 * import all from 'it-all'
 *
 * // This can also be an iterator, generator, etc
 * const values1 = [0, 1, 2, 3, 4]
 * const values2 = [5, 6, 7, 8, 9]
 *
 * const arr = all(merge(values1, values2))
 *
 * console.info(arr) // 0, 1, 2, 3, 4, 5, 6, 7, 8, 9
 * ```
 *
 * Async sources must be awaited:
 *
 * ```javascript
 * import merge from 'it-merge'
 * import all from 'it-all'
 *
 * // This can also be an iterator, async iterator, generator, etc
 * const values1 = async function * () {
 *   yield * [0, 1, 2, 3, 4]
 * }
 * const values2 = async function * () {
 *   yield * [5, 6, 7, 8, 9]
 * }
 *
 * const arr = await all(merge(values1(), values2()))
 *
 * console.info(arr) // 0, 1, 5, 6, 2, 3, 4, 7, 8, 9  <- nb. order is not guaranteed
 * ```
 */

import { queuelessPushable } from 'it-queueless-pushable'
import type { Pushable } from 'it-queueless-pushable'

function isAsyncIterable <T> (thing: any): thing is AsyncIterable<T> {
  return thing[Symbol.asyncIterator] != null
}

async function addAllToPushable <T> (sources: Array<AsyncIterable<T> | Iterable<T>>, output: Pushable<T>, signal: AbortSignal): Promise<void> {
  try {
    await Promise.all(
      sources.map(async (source) => {
        for await (const item of source) {
          await output.push(item, {
            signal
          })
          signal.throwIfAborted()
        }
      })
    )

    await output.end(undefined, {
      signal
    })
  } catch (err: any) {
    await output.end(err, {
      signal
    })
      .catch(() => {})
  }
}

async function * mergeSources <T> (sources: Array<AsyncIterable<T> | Iterable<T>>): AsyncGenerator<T, void, undefined> {
  const controller = new AbortController()
  const output = queuelessPushable<T>()

  addAllToPushable(sources, output, controller.signal)
    .catch(() => {})

  try {
    yield * output
  } finally {
    controller.abort()
  }
}

function * mergeSyncSources <T> (syncSources: Array<Iterable<T>>): Generator<T, void, undefined> {
  for (const source of syncSources) {
    yield * source
  }
}

/**
 * Treat one or more iterables as a single iterable.
 *
 * Nb. sources are iterated over in parallel so the
 * order of emitted items is not guaranteed.
 */
function merge <T> (...sources: Array<Iterable<T>>): Generator<T, void, undefined>
function merge <T> (...sources: Array<AsyncIterable<T> | Iterable<T>>): AsyncGenerator<T, void, undefined>
function merge <T> (...sources: Array<AsyncIterable<T> | Iterable<T>>): AsyncGenerator<T, void, undefined> | Generator<T, void, undefined> {
  const syncSources: Array<Iterable<T>> = []

  for (const source of sources) {
    if (!isAsyncIterable(source)) {
      syncSources.push(source)
    }
  }

  if (syncSources.length === sources.length) {
    // all sources are synchronous
    return mergeSyncSources(syncSources)
  }

  return mergeSources(sources)
}

export default merge
