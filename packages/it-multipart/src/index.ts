/**
 * @packageDocumentation
 *
 * Allows iterating over multipart messages found in a HTTP request/
 *
 * @example
 *
 * ```javascript
 * import http from 'http'
 * import multipart from 'it-multipart'
 *
 * http.createServer(async (req, res) => {
 *   if (req.method === 'POST' && req.headers['content-type']) {
 *     for await (const part of multipart(req)) {
 *       console.log(`part with HTTP headers ${part.headers}`)
 *
 *       // nb. part.body must be consumed before the next part is emitted
 *       for await (const chunk of part.body) {
 *         console.log(`part with content ${part.name} contents:`, chunk.toString())
 *       }
 *     }
 *
 *     console.log('finished parsing')
 *     res.writeHead(200)
 *     res.end()
 *   }
 *
 *   res.writeHead(404)
 *   res.end()
 * }).listen(5001, () => {
 *   console.log('server listening on port 5001')
 * })
 * ```
 */

import formidable from 'formidable'
import { pushable } from 'it-pushable'
import type { IncomingMessage, IncomingHttpHeaders } from 'http'

export interface Part {
  headers: IncomingHttpHeaders
  body: AsyncIterable<Uint8Array>
}

/**
 * Streaming multipart HTTP message parser
 */
export default async function * multipart (request: IncomingMessage): AsyncGenerator<Part, void, undefined> {
  const output = pushable<Part>({
    objectMode: true
  })

  if (request == null) {
    output.end(new Error('request missing'))

    yield * output

    return
  }

  const form = formidable({ keepExtensions: true })

  form.parse(request, err => {
    output.end(err)
  })

  form.onPart = (part) => {
    const body = pushable()

    part.on('data', buf => {
      body.push(buf)
    })
    part.on('end', () => {
      body.end()
    })
    part.on('error', (err) => {
      body.end(err)
    })

    output.push({
      // @ts-expect-error headers is not part of formidable api but is present
      headers: part.headers,
      body
    })
  }

  yield * output
}
