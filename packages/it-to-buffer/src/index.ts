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
