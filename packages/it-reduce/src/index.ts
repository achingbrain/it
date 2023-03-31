function isAsyncIterable <T> (thing: any): thing is AsyncIterable<T> {
  return thing[Symbol.asyncIterator] != null
}

/**
 * Reduces the values yielded by an (async) iterable
 */
function reduce <T, V> (source: Iterable<T>, func: (acc: V, curr: T) => V, init: V): V
function reduce <T, V> (source: Iterable<T> | AsyncIterable<T>, func: (acc: V, curr: T) => V, init: V): Promise<V>
function reduce <T, V> (source: Iterable<T> | AsyncIterable<T>, func: (acc: V, curr: T) => V, init: V): Promise<V> | V {
  if (isAsyncIterable(source)) {
    return (async function () {
      for await (const val of source) {
        init = func(init, val)
      }

      return init
    })()
  }

  for (const val of source) {
    init = func(init, val)
  }

  return init
}

export default reduce
