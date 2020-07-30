'use strict'

// @ts-ignore - untyped dependency
const randomBytes = require('iso-random-stream/src/random')

/**
 * @typedef {Object} Options
 * @property {number} [chunkSize]
 * @property {function(Buffer):void} [collector]
 * @property {function(number):Promise<Buffer>|Buffer} [generator]
 */

/** @type {Options} */
const defaultOptions = {
  chunkSize: 4096,
  collector: () => {},
  generator: (size) => Promise.resolve(randomBytes(size))
}

/**
 * An async iterable that emits buffers containing bytes up to a certain length.
 *
 * @param {number} limit
 * @param {Options} [options]
 * @returns {AsyncIterable<Buffer>}
 */
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
