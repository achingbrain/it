
/**
 * Returns the first result from an (async) iterable, unless empty, in which
 * case returns `undefined`
 */
export default async function first <T> (source: AsyncIterable<T> | Iterable<T>): Promise<T | undefined> {
  for await (const entry of source) { // eslint-disable-line no-unreachable-loop
    return entry
  }

  return undefined
}
