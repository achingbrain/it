/**
 * @packageDocumentation
 *
 * When passed an (async)iterable that yields objects with a `.byteLength`
 * property, throw if the cumulative value of that property reaches a limit.
 *
 * @example
 *
 * ```javascript
 * import limitBytes from 'it-limit-bytes'
 * import drain from 'it-drain'
 *
 * // This can also be an iterator, generator, etc
 * const values = [
 *   Uint8Array.from([0, 1, 2, 3]),
 *   Uint8Array.from([4, 5, 6, 7])
 * ]
 *
 * drain(limitBytes(values, 5))
 * // throws "Read too many bytes - 8/5"
 * ```
 *
 * Async sources must be awaited:
 *
 * ```javascript
 * import limitBytes from 'it-limit-bytes'
 * import drain from 'it-drain'
 *
 * // This can also be an iterator, generator, etc
 * const values = [
 *   Uint8Array.from([0, 1, 2, 3]),
 *   Uint8Array.from([4, 5, 6, 7])
 * ]
 *
 * await drain(limitBytes(values, 5))
 * // throws "Read too many bytes - 8/5"
 * ```
 */

function isAsyncIterable <T> (thing: any): thing is AsyncIterable<T> {
  return thing[Symbol.asyncIterator] != null
}

/**
 * Limits the number of bytes yielded by the passed source
 */
function limitBytes <B extends { byteLength: number }, TReturn = void, TNext = unknown> (source: Iterable<B> | Generator<B, TReturn, TNext>, limit: number): Generator<B, TReturn, TNext>
function limitBytes <B extends { byteLength: number }, TReturn = void, TNext = unknown> (source: AsyncIterable<B> | AsyncGenerator<B, TReturn, TNext>, limit: number): AsyncGenerator<B, TReturn, TNext>
function limitBytes <B extends { byteLength: number }> (source: AsyncIterable<B> | Iterable<B>, limit: number): AsyncGenerator<B, any, any> | Generator<B, any, any> {
  let count = 0

  if (isAsyncIterable(source)) {
    return (async function * () {
      for await (const val of source) {
        count += val.byteLength

        if (count > limit) {
          throw new Error(`Read too many bytes - ${count}/${limit}`)
        }

        yield val
      }
    })()
  }

  return (function * () {
    for (const val of source) {
      count += val.byteLength

      if (count > limit) {
        throw new Error(`Read too many bytes - ${count}/${limit}`)
      }

      yield val
    }
  })()
}

export default limitBytes
