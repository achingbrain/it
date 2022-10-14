'use strict'

// @ts-ignore - untyped dependency
const randomBytes = require('iso-random-stream/src/random')

/**
 * @typedef {Object} Options
 * @property {number} [chunkSize]
 * @property {function(Uint8Array):void} [collector]
 * @property {function(number):Promise<Uint8Array>|Uint8Array} [generator]
 */

/**
 * @typedef {Object} ActualOptions
 * @property {number} chunkSize
 * @property {function(Uint8Array):void} collector
 * @property {function(number):Promise<Uint8Array>|Uint8Array} generator
 */

/** @type {ActualOptions} */
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
 */
async function * bufferStream (limit, options = {}) {
  /** @type {ActualOptions} */
  const opts = Object.assign({}, defaultOptions, options)
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

module.exports = bufferStream
