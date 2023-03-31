function isAsyncIterable <T> (thing: any): thing is AsyncIterable<T> {
  return thing[Symbol.asyncIterator] != null
}

/**
 * Collects all values from an (async) iterable and returns them as an array
 */
function all <T> (source: Iterable<T>): T[]
function all <T> (source: Iterable<T> | AsyncIterable<T>): Promise<T[]>
function all <T> (source: Iterable<T> | AsyncIterable<T>): Promise<T[]> | T[] {
  if (isAsyncIterable(source)) {
    return (async () => {
      const arr = []

      for await (const entry of source) {
        arr.push(entry)
      }

      return arr
    })()
  }

  const arr = []

  for (const entry of source) {
    arr.push(entry)
  }

  return arr
}

export default all
