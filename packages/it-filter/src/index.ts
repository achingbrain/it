
/**
 * Filters the passed (async) iterable by using the filter function
 */
export default async function * filter <T> (source: AsyncIterable<T> | Iterable<T>, fn: (val: T) => boolean | Promise<boolean>): AsyncGenerator<T, void, undefined> {
  for await (const entry of source) {
    if (await fn(entry)) {
      yield entry
    }
  }
}
