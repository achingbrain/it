'use strict'

const globalThis = require('@ungap/global-this')

function itToBrowserReadableStream (source, queuingStrategy = {}) {
  return new globalThis.ReadableStream({
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
  }, queuingStrategy)
}

module.exports = itToBrowserReadableStream
