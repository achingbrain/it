'use strict'

/** @type {typeof window} */
// @ts-ignore
const globalThis = require('@ungap/global-this')

/**
 * @template T
 * @param {AsyncIterator<T>|Iterator<T>} source
 * @param {QueuingStrategy<T>} [queuingStrategy]
 * @returns {ReadableStream<T>}
 */
function itToBrowserReadableStream (source, queuingStrategy = {}) {
  /** @type {UnderlyingSource<T> & { _cancelled:boolean} } */
  const pump = {
    _cancelled: false,
    async start () {
      this._cancelled = false
    },
    async pull (controller) {
      try {
        const { value, done } = await source.next()

        if (this._cancelled) {
          return
        }

        if (done) {
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

  return new globalThis.ReadableStream(pump, queuingStrategy)
}

module.exports = itToBrowserReadableStream
