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

export interface BufferStreamOptions<T extends ArrayBufferLike = ArrayBufferLike> {
  chunkSize?: number
  collector?(arr: Uint8Array<T>): void
  generator?(length: number): Uint8Array<T> | Promise<Uint8Array<T>>
}

const defaultOptions: Required<BufferStreamOptions<ArrayBufferLike>> = {
  chunkSize: 4096,
  collector: () => {},
  generator: async (size) => Promise.resolve(randomBytes(size))
}

/**
 * An async iterable that emits buffers containing bytes up to a certain length
 */
export default function bufferStream (limit: number): AsyncGenerator<Uint8Array<ArrayBuffer>, void, unknown>
export default function bufferStream (limit: number, options: Omit<BufferStreamOptions, 'generator'>): AsyncGenerator<Uint8Array<ArrayBuffer>, void, unknown>
export default function bufferStream <T extends ArrayBufferLike = ArrayBufferLike> (limit: number, options?: BufferStreamOptions<T>): AsyncGenerator<Uint8Array<T>, void, unknown>
export default async function * bufferStream <T extends ArrayBufferLike = ArrayBufferLike> (limit: number, options: BufferStreamOptions<T> = {}): AsyncGenerator<Uint8Array<T | SharedArrayBuffer | ArrayBuffer>, void, unknown> {
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
    bytes = bytes.subarray(0, nextChunkSize)

    opts.collector(bytes)
    emitted += nextChunkSize

    yield bytes
  }
}
