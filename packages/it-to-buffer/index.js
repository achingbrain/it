'use strict'

const { concat: uint8ArrayConcat } = require('uint8arrays/concat')

/**
 * Takes an (async) iterable that yields buffer-like-objects and concats them
 * into one buffer
 * @param {AsyncIterable<Uint8Array>|Iterable<Uint8Array>} stream
 */
async function toBuffer (stream) {
  let buffer = new Uint8Array(0)

  for await (const buf of stream) {
    buffer = uint8ArrayConcat([buffer, buf], buffer.length + buf.length)
  }

  return buffer
}

module.exports = toBuffer
