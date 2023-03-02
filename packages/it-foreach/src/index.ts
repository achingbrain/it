
/**
 * Invokes the passed function for each item in an iterable
 */
export default async function * forEach <T> (source: AsyncIterable<T> | Iterable<T>, fn: (thing: T) => void | Promise<void>): AsyncGenerator<T, void, undefined> {
  for await (const thing of source) {
    await fn(thing)
    yield thing
  }
}
