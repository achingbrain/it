import randomBytes from 'iso-random-stream/src/random.js'

export interface BufferStreamOptions {
  chunkSize?: number
  collector?: (arr: Uint8Array) => void
  generator?: (lenght: number) => Uint8Array | Promise<Uint8Array>
}

const defaultOptions: Required<BufferStreamOptions> = {
  chunkSize: 4096,
  collector: () => {},
  generator: async (size) => await Promise.resolve(randomBytes(size))
}

/**
 * An async iterable that emits buffers containing bytes up to a certain length
 */
export default async function * bufferStream (limit: number, options: BufferStreamOptions = {}) {
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
