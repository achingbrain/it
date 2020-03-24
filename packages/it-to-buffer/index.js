'use strict'

const { Buffer } = require('buffer')

async function toBuffer (stream) {
  let buffer = Buffer.alloc(0)

  for await (const buf of stream) {
    buffer = Buffer.concat([buffer, buf], buffer.length + buf.length)
  }

  return buffer
}

module.exports = toBuffer
