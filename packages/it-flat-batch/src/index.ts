/**
 * @packageDocumentation
 *
 * The final batch may be smaller than requested batch size.
 *
 * @example
 *
 * ```javascript
 * import batch from 'it-flat-batch'
 * import all from 'it-all'
 *
 * // This can also be an iterator, async iterator, generator, etc
 * const values = [[0, 1, 2], [3], [4]]
 * const batchSize = 2
 *
 * const result = all(batch(values, batchSize))
 *
 * console.info(result) // [0, 1], [2, 3], [4]
 * ```
 *
 * Async sources must be awaited:
 *
 * ```javascript
 * import batch from 'it-flat-batch'
 * import all from 'it-all'
 *
 * const values = async function * () {
 *   yield * [[0, 1, 2], [3], [4]]
 * }
 * const batchSize = 2
 *
 * const result = await all(batch(values(), batchSize))
 *
 * console.info(result) // [0, 1], [2, 3], [4]
 * ```
 */

function isAsyncIterable <T> (thing: any): thing is AsyncIterable<T> {
  return thing[Symbol.asyncIterator] != null
}

/**
 * Takes an (async) iterable that emits variable length arrays of things and
 * returns an async iterable that emits those things in fixed-size batches
 */
function batch <T> (source: Iterable<T[]>, batchSize?: number): Generator<T[], void, undefined>
function batch <T> (source: Iterable<T[]> | AsyncIterable<T[]>, batchSize?: number): AsyncGenerator<T[], void, undefined>
function batch <T> (source: Iterable<T[]> | AsyncIterable<T[]>, batchSize: number = 1): AsyncGenerator<T[], void, undefined> | Generator<T[], void, undefined> {
  let size = parseInt(`${batchSize}`)

  if (isNaN(size) || size < 1) {
    size = 1
  }

  let things: T[] = []

  if (isAsyncIterable(source)) {
    return (async function * () {
      for await (const set of source) {
        things = things.concat(set)

        while (things.length >= size) {
          yield things.slice(0, size)

          things = things.slice(size)
        }
      }

      while (things.length > 0) {
        yield things.slice(0, size)

        things = things.slice(size)
      }
    })()
  }

  return (function * () {
    for (const set of source) {
      things = things.concat(set)

      while (things.length >= size) {
        yield things.slice(0, size)

        things = things.slice(size)
      }
    }

    while (things.length > 0) {
      yield things.slice(0, size)

      things = things.slice(size)
    }
  })()
}

export default batch
