'use strict'

const { Buffer } = require('buffer')

/**
 * Takes an (async) iterable that yields buffer-like-objects and concats them
 * into one buffer
 * @param {AsyncIterable<Buffer>|Iterable<Buffer>} stream
 * @returns {Promise<Buffer>}
 */
async function toBuffer (stream) {
  let buffer = Buffer.alloc(0)

  for await (const buf of stream) {
    buffer = Buffer.concat([buffer, buf], buffer.length + buf.length)
  }

  return buffer
}

module.exports = toBuffer
