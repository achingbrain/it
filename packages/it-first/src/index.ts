function isAsyncIterable <T> (thing: any): thing is AsyncIterable<T> {
  return thing[Symbol.asyncIterator] != null
}

/**
 * Returns the first result from an (async) iterable, unless empty, in which
 * case returns `undefined`
 */
function first <T> (source: Iterable<T>): T | undefined
function first <T> (source: Iterable<T> | AsyncIterable<T>): Promise<T | undefined>
function first <T> (source: Iterable<T> | AsyncIterable<T>): Promise<T | undefined> | T | undefined {
  if (isAsyncIterable(source)) {
    return (async () => {
      for await (const entry of source) { // eslint-disable-line no-unreachable-loop
        return entry
      }

      return undefined
    })()
  }

  for (const entry of source) { // eslint-disable-line no-unreachable-loop
    return entry
  }

  return undefined
}

export default first
