/**
 * Returns the last item of an (async) iterable, unless empty, in which case
 * return `undefined`
 */
export default async function last <T> (source: AsyncIterable<T> | Iterable<T>): Promise<T | undefined> {
  let res

  for await (const entry of source) {
    res = entry
  }

  return res
}
