
/**
 * Takes an (async) iterable that emits variable length arrays of things and
 * returns an async iterable that emits those things in fixed-size batches
 */
export default async function * batch <T> (source: AsyncIterable<T[]> | Iterable<T[]>, batchSize: number = 1): AsyncGenerator<T[], void, undefined> {
  // @ts-expect-error - expects string not a number
  let size = parseInt(batchSize)

  if (isNaN(size) || size < 1) {
    size = 1
  }

  let things: T[] = []

  for await (const set of source) {
    things = things.concat(set)

    while (things.length >= size) {
      yield things.slice(0, size)

      things = things.slice(size)
    }
  }

  while (things.length > 0) {
    yield things.slice(0, size)

    things = things.slice(size)
  }
}
