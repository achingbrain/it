function isAsyncIterable <T> (thing: any): thing is AsyncIterable<T> {
  return thing[Symbol.asyncIterator] != null
}

/**
 * Stop iteration after n items have been received
 */
function take <T> (source: Iterable<T>, limit: number): Generator<T, void, undefined>
function take <T> (source: Iterable<T> | AsyncIterable<T>, limit: number): AsyncGenerator<T, void, undefined>
function take <T> (source: Iterable<T> | AsyncIterable<T>, limit: number): AsyncGenerator<T, void, undefined> | Generator<T, void, undefined> {
  if (isAsyncIterable(source)) {
    return (async function * () {
      let items = 0

      if (limit < 1) {
        return
      }

      for await (const entry of source) {
        yield entry

        items++

        if (items === limit) {
          return
        }
      }
    })()
  }

  return (function * () {
    let items = 0

    if (limit < 1) {
      return
    }

    for (const entry of source) {
      yield entry

      items++

      if (items === limit) {
        return
      }
    }
  })()
}

export default take
