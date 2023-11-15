/**
 * @packageDocumentation
 *
 * Consumes all values from an (async)iterable and returns them sorted by the passed sort function.
 *
 * @example
 *
 * ```javascript
 * import sort from 'it-sort'
 * import all from 'it-all'
 *
 * const sorter = (a, b) => {
 *   return a.localeCompare(b)
 * }
 *
 * // This can also be an iterator, generator, etc
 * const values = ['foo', 'bar']
 *
 * const arr = all(sort(values, sorter))
 *
 * console.info(arr) // 'bar', 'foo'
 * ```
 *
 * Async sources must be awaited:
 *
 * ```javascript
 * import sort from 'it-sort'
 * import all from 'it-all'
 *
 * const sorter = (a, b) => {
 *   return a.localeCompare(b)
 * }
 *
 * const values = async function * () {
 *   yield * ['foo', 'bar']
 * }
 *
 * const arr = await all(sort(values, sorter))
 *
 * console.info(arr) // 'bar', 'foo'
 * ```
 */

import all from 'it-all'

function isAsyncIterable <T> (thing: any): thing is AsyncIterable<T> {
  return thing[Symbol.asyncIterator] != null
}

export interface CompareFunction<T> {
  (a: T, b: T): number
}

/**
 * Collects all values from an async iterator, sorts them
 * using the passed function and yields them
 */
function sort <T> (source: Iterable<T>, sorter: CompareFunction<T>): Generator<T, void, undefined>
function sort <T> (source: Iterable<T> | AsyncIterable<T>, sorter: CompareFunction<T>): AsyncGenerator<T, void, undefined>
function sort <T> (source: Iterable<T> | AsyncIterable<T>, sorter: CompareFunction<T>): AsyncGenerator<T, void, undefined> | Generator<T, void, undefined> {
  if (isAsyncIterable(source)) {
    return (async function * () {
      const arr = await all(source)

      yield * arr.sort(sorter)
    })()
  }

  return (function * () {
    const arr = all(source)

    yield * arr.sort(sorter)
  })()
}

export default sort
