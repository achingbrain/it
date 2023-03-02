
/**
 * Stop iteration after n items have been received
 */
export default async function * take <T> (source: AsyncIterable<T> | Iterable<T>, limit: number): AsyncGenerator<T, void, undefined> {
  let items = 0

  if (limit < 1) {
    return
  }

  for await (const entry of source) {
    yield entry

    items++

    if (items === limit) {
      return
    }
  }
}
