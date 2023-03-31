function isAsyncIterable <T> (thing: any): thing is AsyncIterable<T> {
  return thing[Symbol.asyncIterator] != null
}

/**
 * Takes an (async) iterable that emits things and returns an async iterable that
 * emits those things in fixed-sized batches
 */
function batch <T> (source: Iterable<T>, size?: number): Generator<T[], void, undefined>
function batch <T> (source: Iterable<T> | AsyncIterable<T>, size?: number): AsyncGenerator<T[], void, undefined>
function batch <T> (source: Iterable<T> | AsyncIterable<T>, size: number = 1): Generator<T[], void, undefined> | AsyncGenerator<T[], void, undefined> {
  size = Number(size)

  if (isAsyncIterable(source)) {
    return (async function * () {
      let things: T[] = []

      if (size < 1) {
        size = 1
      }

      if (size !== Math.round(size)) {
        throw new Error('Batch size must be an integer')
      }

      for await (const thing of source) {
        things.push(thing)

        while (things.length >= size) {
          yield things.slice(0, size)

          things = things.slice(size)
        }
      }

      while (things.length > 0) {
        yield things.slice(0, size)

        things = things.slice(size)
      }
    }())
  }

  return (function * () {
    let things: T[] = []

    if (size < 1) {
      size = 1
    }

    if (size !== Math.round(size)) {
      throw new Error('Batch size must be an integer')
    }

    for (const thing of source) {
      things.push(thing)

      while (things.length >= size) {
        yield things.slice(0, size)

        things = things.slice(size)
      }
    }

    while (things.length > 0) {
      yield things.slice(0, size)

      things = things.slice(size)
    }
  }())
}

export default batch
