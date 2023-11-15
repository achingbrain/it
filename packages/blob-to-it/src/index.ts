/**
 * @packageDocumentation
 *
 * Allows reading Blob contents as an async iterator.
 *
 * @example
 *
 * ```javascript
 * import toIt from 'blob-to-it'
 * import all from 'it-all'
 *
 * const content = [ Uint8Array.from([0, 1, 2, 3, 4]) ]
 * const blob = new Blob(content)
 * const arr = await all(toIt(blob))
 *
 * console.info(arr) // [ [ 0, 1, 2, 3, 4 ] ]
 * ```
 */

import browserReadableStreamToIt from 'browser-readablestream-to-it'

export default function blobToIt (blob: Blob): AsyncIterable<Uint8Array> {
  if (typeof blob.stream === 'function') {
    return browserReadableStreamToIt(blob.stream())
  }

  // firefox < 69 does not support blob.stream()
  // @ts-expect-error - response.body is optional, but in practice it's a stream.
  return browserReadableStreamToIt(new Response(blob).body)
}
