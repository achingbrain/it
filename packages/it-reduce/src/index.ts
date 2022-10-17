
/**
 * Reduces the values yielded by an (async) iterable
 */
export default async function reduce <T, V> (source: AsyncIterable<T> | Iterable<T>, func: (acc: V, curr: T) => V, init: V): Promise<V> {
  for await (const val of source) {
    init = func(init, val)
  }

  return init
}
