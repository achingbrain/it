'use strict'

/**
 * @typedef {Object} SourceExt
 * @property {boolean} [_cancelled]
 */
/**
 * @template T
 * @typedef {SourceExt & UnderlyingSource<T>} Source
 */

/**
 * @template T
 * @param {AsyncIterator<T>|Iterator<T>} source
 * @param {QueuingStrategy<T>} [queuingStrategy]
 * @returns {ReadableStream<T>}
 */
function itToBrowserReadableStream (source, queuingStrategy = {}) {
  return new globalThis.ReadableStream(/** @type {Source<T>} */({
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
  }), queuingStrategy)
}

module.exports = itToBrowserReadableStream
