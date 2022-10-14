/**
 * Takes an (async) iterable that emits things and returns an async iterable that
 * emits those things in fixed-sized batches
 */
export default async function * batch <T> (source: AsyncIterable<T> | Iterable<T>, size: number = 1): AsyncGenerator<T[], void, undefined> {
  let things: T[] = []

  if (size < 1) {
    size = 1
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
}
