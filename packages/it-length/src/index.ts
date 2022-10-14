/**
 * Consumes the passed iterator and returns the number of items it contained
 */
export default async function length (iterator: AsyncIterable<unknown> | Iterable<unknown>): Promise<number> {
  let count = 0

  for await (const _ of iterator) { // eslint-disable-line no-unused-vars,@typescript-eslint/no-unused-vars
    count++
  }

  return count
}
