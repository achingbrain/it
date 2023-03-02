
/**
 * Skip items from an iterable
 */
export default async function * skip <T> (source: AsyncIterable<T> | Iterable<T>, offset: number): AsyncGenerator<T, void, undefined> {
  for await (const entry of source) {
    if (offset === 0) {
      yield entry

      continue
    }

    offset--
  }
}
