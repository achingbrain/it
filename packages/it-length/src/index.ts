/**
 * @packageDocumentation
 *
 * Counts the number of items in an (async)iterable.
 *
 * N.b. will consume the iterable
 *
 * @example
 *
 * ```javascript
 * import length from 'it-length'
 *
 * // This can also be an iterator, generator, etc
 * const values = [0, 1, 2, 3, 4]
 *
 * const res = length(values)
 *
 * console.info(res) // 5
 * ```
 *
 * Async sources must be awaited:
 *
 * ```javascript
 * import length from 'it-length'
 *
 * const values = async function * () {
 *   yield * [0, 1, 2, 3, 4]
 * }
 *
 * const res = await length(values())
 *
 * console.info(res) // 5
 * ```
 */

function isAsyncIterable <T> (thing: any): thing is AsyncIterable<T> {
  return thing[Symbol.asyncIterator] != null
}

/**
 * Consumes the passed iterator and returns the number of items it contained
 */
function length (source: Iterable<unknown>): number
function length (source: Iterable<unknown> | AsyncIterable<unknown>): Promise<number>
function length (source: Iterable<unknown> | AsyncIterable<unknown>): Promise<number> | number {
  if (isAsyncIterable(source)) {
    return (async () => {
      let count = 0

      for await (const _ of source) { // eslint-disable-line @typescript-eslint/no-unused-vars
        count++
      }

      return count
    })()
  } else {
    let count = 0

    for (const _ of source) { // eslint-disable-line @typescript-eslint/no-unused-vars
      count++
    }

    return count
  }
}

export default length
