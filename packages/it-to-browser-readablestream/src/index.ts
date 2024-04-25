/**
 * @packageDocumentation
 *
 * Turns an (async)iterable into a W3C ReadbleStream.
 *
 * @example
 *
 * ```javascript
 * import toBrowserReadableStream from 'it-to-browser-readablestream'
 *
 * // This can also be an iterator, async iterator, generator, etc
 * const values = [Buffer.from([0, 1]), Buffer.from([2, 3])]
 *
 * const stream = await toBrowserReadableStream(values)
 *
 * for await (const buf of stream) {
 *   console.info(buf) // Buffer[0, 1]
 * }
 * ```
 */

import { getIterator } from 'get-iterator'

interface SourceExt {
  _cancelled: boolean
}

type Source<T> = SourceExt & UnderlyingSource<T>

/**
 * Converts an (async) iterator into a WHATWG ReadableStream
 */
export default function itToBrowserReadableStream <T extends ArrayBufferView> (source: AsyncIterable<T> | Iterable<T>, queuingStrategy: QueuingStrategy<T> = {}): ReadableStream<T> {
  const iter = getIterator<T>(source)

  const s: Source<ArrayBufferView> = {
    _cancelled: false,

    async start () {
      this._cancelled = false
    },
    async pull (controller) {
      try {
        const { value, done } = await iter.next()

        if (this._cancelled) {
          return
        }

        if (done === true) {
          controller.close()
          return
        }

        controller.enqueue(value)
      } catch (err) {
        controller.error(err)
      }
    },
    cancel () {
      this._cancelled = true
    }
  }

  return new globalThis.ReadableStream(s, queuingStrategy)
}
