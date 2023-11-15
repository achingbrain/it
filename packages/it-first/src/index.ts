/**
 * @packageDocumentation
 *
 * Return the first value in an (async)iterable
 *
 * @example
 *
 * ```javascript
 * import first from 'it-first'
 *
 * // This can also be an iterator, generator, etc
 * const values = [0, 1, 2, 3, 4]
 *
 * const res = first(values)
 *
 * console.info(res) // 0
 * ```
 *
 * Async sources must be awaited:
 *
 * ```javascript
 * import first from 'it-first'
 *
 * const values = async function * () {
 *   yield * [0, 1, 2, 3, 4]
 * }
 *
 * const res = await first(values())
 *
 * console.info(res) // 0
 * ```
 */

function isAsyncIterable <T> (thing: any): thing is AsyncIterable<T> {
  return thing[Symbol.asyncIterator] != null
}

/**
 * Returns the first result from an (async) iterable, unless empty, in which
 * case returns `undefined`
 */
function first <T> (source: Iterable<T>): T | undefined
function first <T> (source: Iterable<T> | AsyncIterable<T>): Promise<T | undefined>
function first <T> (source: Iterable<T> | AsyncIterable<T>): Promise<T | undefined> | T | undefined {
  if (isAsyncIterable(source)) {
    return (async () => {
      for await (const entry of source) { // eslint-disable-line no-unreachable-loop
        return entry
      }

      return undefined
    })()
  }

  for (const entry of source) { // eslint-disable-line no-unreachable-loop
    return entry
  }

  return undefined
}

export default first
