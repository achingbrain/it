import all from 'it-all'

export interface CompareFunction<T> {
  (a: T, b: T): number
}

/**
 * Collects all values from an async iterator, sorts them
 * using the passed function and yields them
 */
export default async function * sort <T> (source: AsyncIterable<T> | Iterable<T>, sorter: CompareFunction<T>): AsyncGenerator<T, void, undefined> {
  const arr = await all(source)

  yield * arr.sort(sorter)
}
