/**
 * Takes an (async) iterable and returns one with each item mapped by the passed
 * function
 */
export default async function * map <I, O> (source: AsyncIterable<I> | Iterable<I>, func: (val: I) => O | Promise<O>): AsyncGenerator<O, void, undefined> {
  for await (const val of source) {
    yield func(val)
  }
}
