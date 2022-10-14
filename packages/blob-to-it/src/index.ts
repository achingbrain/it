/* eslint-env browser */

import browserReadableStreamToIt from 'browser-readablestream-to-it'

export default function blobToIt (blob: Blob): AsyncIterable<Uint8Array> {
  if (typeof blob.stream === 'function') {
    // @ts-ignore missing some properties
    return browserReadableStreamToIt(blob.stream())
  }

  // firefox < 69 does not support blob.stream()
  // @ts-ignore - response.body is optional, but in practice it's a stream.
  return browserReadableStreamToIt(new Response(blob).body)
}
