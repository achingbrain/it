function isAsyncIterable <T> (thing: any): thing is AsyncIterable<T> {
  return thing[Symbol.asyncIterator] != null
}

/**
 * Consumes the passed iterator and returns the number of items it contained
 */
function length (source: Iterable<unknown>): number
function length (source: Iterable<unknown> | AsyncIterable<unknown>): Promise<number>
function length (source: Iterable<unknown> | AsyncIterable<unknown>): Promise<number> | number {
  if (isAsyncIterable(source)) {
    return (async () => {
      let count = 0

      for await (const _ of source) { // eslint-disable-line no-unused-vars,@typescript-eslint/no-unused-vars
        count++
      }

      return count
    })()
  } else {
    let count = 0

    for (const _ of source) { // eslint-disable-line no-unused-vars,@typescript-eslint/no-unused-vars
      count++
    }

    return count
  }
}

export default length
