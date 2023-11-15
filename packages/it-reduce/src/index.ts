/**
 * @packageDocumentation
 *
 * Reduce the values of an (async)iterable to a single value.
 *
 * @example
 *
 * ```javascript
 * import reduce from 'it-reduce'
 *
 * // This can also be an iterator, generator, etc
 * const values = [0, 1, 2, 3, 4]
 *
 * const result = reduce(values, (acc, curr) => acc + curr, 0)
 *
 * console.info(result) // 10
 * ```
 *
 * Async sources must be awaited:
 *
 * ```javascript
 * import reduce from 'it-reduce'
 *
 * const values = async function * () {
 *   yield * [0, 1, 2, 3, 4]
 * }
 *
 * const result = await reduce(values(), (acc, curr) => acc + curr, 0)
 *
 * console.info(result) // 10
 * ```
 */

function isAsyncIterable <T> (thing: any): thing is AsyncIterable<T> {
  return thing[Symbol.asyncIterator] != null
}

/**
 * Reduces the values yielded by an (async) iterable
 */
function reduce <T, V> (source: Iterable<T>, func: (acc: V, curr: T) => V, init: V): V
function reduce <T, V> (source: Iterable<T> | AsyncIterable<T>, func: (acc: V, curr: T) => V, init: V): Promise<V>
function reduce <T, V> (source: Iterable<T> | AsyncIterable<T>, func: (acc: V, curr: T) => V, init: V): Promise<V> | V {
  if (isAsyncIterable(source)) {
    return (async function () {
      for await (const val of source) {
        init = func(init, val)
      }

      return init
    })()
  }

  for (const val of source) {
    init = func(init, val)
  }

  return init
}

export default reduce
