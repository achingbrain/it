
/**
 * Collects all values from an (async) iterable and returns them as an array
 */
export default async function all <T> (source: AsyncIterable<T> | Iterable<T>): Promise<T[]> {
  const arr = []

  for await (const entry of source) {
    arr.push(entry)
  }

  return arr
}
