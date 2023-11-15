/**
 * @packageDocumentation
 *
 * Generate a stream of buffers, useful for testing purposes.
 *
 * @example
 *
 * ```javascript
 * import bufferStream from 'it-buffer-stream'
 *
 * const totalLength = //... a big number
 *
 * // all options are optional, defaults are shown
 * const options = {
 *   chunkSize: 4096, // how many bytes will be in each buffer
 *   collector: (buffer) => {
 *     // will be called as each buffer is generated. the final buffer
 *     // may be smaller than `chunkSize`
 *   },
 *   generator: async (size) => {
 *     // return a promise that resolves to a buffer of length `size`
 *     //
 *     // if omitted, `Promise.resolve(crypto.randomBytes(size))` will be used
 *   }
 * }
 *
 * let buffers = []
 *
 * for await (buf of bufferStream(totalLength, options)) {
 *   buffers.push(buf)
 * }
 *
 * // `buffers` is an array of Buffers the combined length of which === totalLength
 * ```
 */

import randomBytes from 'iso-random-stream/src/random.js'

export interface BufferStreamOptions {
  chunkSize?: number
  collector?(arr: Uint8Array): void
  generator?(length: number): Uint8Array | Promise<Uint8Array>
}

const defaultOptions: Required<BufferStreamOptions> = {
  chunkSize: 4096,
  collector: () => {},
  generator: async (size) => Promise.resolve(randomBytes(size))
}

/**
 * An async iterable that emits buffers containing bytes up to a certain length
 */
export default async function * bufferStream (limit: number, options: BufferStreamOptions = {}): AsyncGenerator<Uint8Array, void, unknown> {
  const opts: Required<BufferStreamOptions> = Object.assign({}, defaultOptions, options)
  let emitted = 0

  const arr = []
  arr.length = Math.ceil(limit / opts.chunkSize)

  while (emitted < limit) {
    const nextLength = emitted + opts.chunkSize
    let nextChunkSize = opts.chunkSize

    if (nextLength > limit) {
      // emit the final chunk
      nextChunkSize = limit - emitted
    }

    let bytes = await opts.generator(nextChunkSize)
    bytes = bytes.slice(0, nextChunkSize)

    opts.collector(bytes)
    emitted += nextChunkSize

    yield bytes
  }
}
