
interface SourceExt {
  _cancelled: boolean
}

type Source<T> = SourceExt & UnderlyingSource<T>

/**
 * Converts an (async) iterator into a WHATWG ReadableStream
 */
export default function itToBrowserReadableStream <T> (source: AsyncIterator<T>|Iterator<T>, queuingStrategy: QueuingStrategy<T> = {}): ReadableStream<T> {
  const s: Source<T> = {
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
