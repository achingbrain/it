function isAsyncIterable <T> (thing: any): thing is AsyncIterable<T> {
  return thing[Symbol.asyncIterator] != null
}

/**
 * Skip items from an iterable
 */
function skip <T> (source: Iterable<T>, offset: number): Generator<T, void, undefined>
function skip <T> (source: AsyncIterable<T>, offset: number): AsyncGenerator<T, void, undefined>
function skip <T> (source: AsyncIterable<T> | Iterable<T>, offset: number): AsyncGenerator<T, void, undefined> | Generator<T, void, undefined> {
  if (isAsyncIterable(source)) {
    return (async function * () {
      for await (const entry of source) {
        if (offset === 0) {
          yield entry

          continue
        }

        offset--
      }
    })()
  }

  return (function * () {
    for (const entry of source) {
      if (offset === 0) {
        yield entry

        continue
      }

      offset--
    }
  })()
}

export default skip
