'use strict'

const randomBytes = require('iso-random-stream/src/random')

const defaultOptions = {
  chunkSize: 4096,
  collector: () => {},
  generator: (size) => Promise.resolve(randomBytes(size))
}

async function * bufferStream (limit, options = {}) {
  options = Object.assign({}, defaultOptions, options)
  let emitted = 0

  const arr = []
  arr.length = Math.ceil(limit / options.chunkSize)

  while (emitted < limit) {
    const nextLength = emitted + options.chunkSize
    let nextChunkSize = options.chunkSize

    if (nextLength > limit) {
      // emit the final chunk
      nextChunkSize = limit - emitted
    }

    let bytes = await options.generator(nextChunkSize)
    bytes = bytes.slice(0, nextChunkSize)

    options.collector(bytes)
    emitted += nextChunkSize

    yield bytes
  }
}

module.exports = bufferStream
