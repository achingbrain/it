/* eslint-env browser */

'use strict'

const browserReadableStreamToIt = require('browser-readablestream-to-it')

function blobToIt (blob) {
  if (typeof blob.stream === 'function') {
    return browserReadableStreamToIt(blob.stream())
  }

  // firefox < 69 does not support blob.stream()
  return browserReadableStreamToIt(new Response(blob).body)
}

module.exports = blobToIt
