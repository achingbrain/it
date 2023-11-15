/**
 * @packageDocumentation
 *
 * For when you are only interested in later values from an (async)iterable.
 *
 * @example
 *
 * ```javascript
 * import take from 'it-skip'
 * import all from 'it-all'
 *
 * // This can also be an iterator, generator, etc
 * const values = [0, 1, 2, 3, 4]
 *
 * const arr = all(skip(values, 2))
 *
 * console.info(arr) // 2, 3, 4
 * ```
 *
 * Async sources must be awaited:
 *
 * ```javascript
 * import take from 'it-skip'
 * import all from 'it-all'
 *
 * const values = async function * () {
 *   yield * [0, 1, 2, 3, 4]
 * }
 *
 * const arr = await all(skip(values(), 2))
 *
 * console.info(arr) // 2, 3, 4
 * ```
 */

function isAsyncIterable <T> (thing: any): thing is AsyncIterable<T> {
  return thing[Symbol.asyncIterator] != null
}

/**
 * Skip items from an iterable
 */
function skip <T> (source: Iterable<T>, offset: number): Generator<T, void, undefined>
function skip <T> (source: Iterable<T> | AsyncIterable<T>, offset: number): AsyncGenerator<T, void, undefined>
function skip <T> (source: Iterable<T> | AsyncIterable<T>, offset: number): AsyncGenerator<T, void, undefined> | Generator<T, void, undefined> {
  if (isAsyncIterable(source)) {
    return (async function * () {
      for await (const entry of source) {
        if (offset === 0) {
          yield entry

          continue
        }

        offset--
      }
    })()
  }

  return (function * () {
    for (const entry of source) {
      if (offset === 0) {
        yield entry

        continue
      }

      offset--
    }
  })()
}

export default skip
