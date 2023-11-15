/**
 * @packageDocumentation
 *
 * For when you need a one-liner to collect iterable values.
 *
 * @example
 *
 * ```javascript
 * import all from 'it-all'
 *
 * // This can also be an iterator, etc
 * const values = function * () {
 *   yield * [0, 1, 2, 3, 4]
 * }
 *
 * const arr = all(values)
 *
 * console.info(arr) // 0, 1, 2, 3, 4
 * ```
 *
 * Async sources must be awaited:
 *
 * ```javascript
 * const values = async function * () {
 *   yield * [0, 1, 2, 3, 4]
 * }
 *
 * const arr = await all(values())
 *
 * console.info(arr) // 0, 1, 2, 3, 4
 * ```
 */

function isAsyncIterable <T> (thing: any): thing is AsyncIterable<T> {
  return thing[Symbol.asyncIterator] != null
}

/**
 * Collects all values from an (async) iterable and returns them as an array
 */
function all <T> (source: Iterable<T>): T[]
function all <T> (source: Iterable<T> | AsyncIterable<T>): Promise<T[]>
function all <T> (source: Iterable<T> | AsyncIterable<T>): Promise<T[]> | T[] {
  if (isAsyncIterable(source)) {
    return (async () => {
      const arr = []

      for await (const entry of source) {
        arr.push(entry)
      }

      return arr
    })()
  }

  const arr = []

  for (const entry of source) {
    arr.push(entry)
  }

  return arr
}

export default all
