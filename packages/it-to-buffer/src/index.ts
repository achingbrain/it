import { concat as uint8ArrayConcat } from 'uint8arrays/concat'

/**
 * Takes an (async) iterable that yields buffer-like-objects and concats them
 * into one buffer
 */
export default async function toBuffer (stream: AsyncIterable<Uint8Array> | Iterable<Uint8Array>): Promise<Uint8Array> {
  let buffer = new Uint8Array(0)

  for await (const buf of stream) {
    buffer = uint8ArrayConcat([buffer, buf], buffer.length + buf.length)
  }

  return buffer
}
