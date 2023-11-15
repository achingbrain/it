/**
 * @packageDocumentation
 *
 * Return the last value from an (async)iterable.
 *
 * @example
 *
 * ```javascript
 * import last from 'it-last'
 *
 * // This can also be an iterator, generator, etc
 * const values = [0, 1, 2, 3, 4]
 *
 * const res = last(values)
 *
 * console.info(res) // 4
 * ```
 *
 * Async sources must be awaited:
 *
 * ```javascript
 * import last from 'it-last'
 *
 * const values = async function * () {
 *   yield * [0, 1, 2, 3, 4]
 * }
 *
 * const res = await last(values())
 *
 * console.info(res) // 4
 * ```
 */

function isAsyncIterable <T> (thing: any): thing is AsyncIterable<T> {
  return thing[Symbol.asyncIterator] != null
}

/**
 * Returns the last item of an (async) iterable, unless empty, in which case
 * return `undefined`
 */
function last <T> (source: Iterable<T>): T | undefined
function last <T> (source: Iterable<T> | AsyncIterable<T>): Promise<T | undefined>
function last <T> (source: Iterable<T> | AsyncIterable<T>): Promise<T | undefined> | T | undefined {
  if (isAsyncIterable(source)) {
    return (async () => {
      let res

      for await (const entry of source) {
        res = entry
      }

      return res
    })()
  }

  let res

  for (const entry of source) {
    res = entry
  }

  return res
}

export default last
