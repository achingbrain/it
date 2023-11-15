/**
 * @packageDocumentation
 *
 * Collects all `Uint8Array` values from an (async)iterable and returns them as a single `Uint8Array`.
 *
 * @example
 *
 * ```javascript
 * import toBuffer from 'it-to-buffer'
 *
 * // This can also be an iterator, generator, etc
 * const values = [Buffer.from([0, 1]), Buffer.from([2, 3])]
 *
 * const result = toBuffer(values)
 *
 * console.info(result) // Buffer[0, 1, 2, 3]
 * ```
 *
 * Async sources must be awaited:
 *
 * ```javascript
 * import toBuffer from 'it-to-buffer'
 *
 * const values = async function * () {
 *   yield Buffer.from([0, 1])
 *   yield Buffer.from([2, 3])
 * }
 *
 * const result = await toBuffer(values())
 *
 * console.info(result) // Buffer[0, 1, 2, 3]
 * ```
 */

import { concat as uint8ArrayConcat } from 'uint8arrays/concat'

function isAsyncIterable <T> (thing: any): thing is AsyncIterable<T> {
  return thing[Symbol.asyncIterator] != null
}

/**
 * Takes an (async) iterable that yields buffer-like-objects and concats them
 * into one buffer
 */
function toBuffer (source: Iterable<Uint8Array>): Uint8Array
function toBuffer (source: Iterable<Uint8Array> | AsyncIterable<Uint8Array>): Promise<Uint8Array>
function toBuffer (source: Iterable<Uint8Array> | AsyncIterable<Uint8Array>): Promise<Uint8Array> | Uint8Array {
  if (isAsyncIterable(source)) {
    return (async () => {
      let buffer = new Uint8Array(0)

      for await (const buf of source) {
        buffer = uint8ArrayConcat([buffer, buf], buffer.length + buf.length)
      }

      return buffer
    })()
  }

  const bufs = []
  let length = 0

  for (const buf of source) {
    bufs.push(buf)
    length += buf.byteLength
  }

  return uint8ArrayConcat(bufs, length)
}

export default toBuffer
