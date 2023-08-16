export interface BrowserReadableStreamToItOptions {
  preventCancel?: boolean
}

/**
 * Turns a browser readable stream into an async iterable. Async iteration over
 * returned iterable will lock give stream, preventing any other consumer from
 * acquiring a reader. The lock will be released if iteration loop is broken. To
 * prevent stream cancelling optional `{ preventCancel: true }` could be passed
 * as a second argument.
 */
export default async function * browserReadableStreamToIt <T> (stream: ReadableStream<T>, options: BrowserReadableStreamToItOptions = {}): AsyncGenerator<T, void, undefined> {
  const reader = stream.getReader()

  try {
    while (true) {
      const result = await reader.read()

      if (result.done) {
        return
      }

      yield result.value
    }
  } finally {
    if (options.preventCancel !== true) {
      await reader.cancel()
    }

    reader.releaseLock()
  }
}
