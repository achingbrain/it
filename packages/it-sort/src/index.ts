import all from 'it-all'

function isAsyncIterable <T> (thing: any): thing is AsyncIterable<T> {
  return thing[Symbol.asyncIterator] != null
}

export interface CompareFunction<T> {
  (a: T, b: T): number
}

/**
 * Collects all values from an async iterator, sorts them
 * using the passed function and yields them
 */
function sort <T> (source: Iterable<T>, sorter: CompareFunction<T>): Generator<T, void, undefined>
function sort <T> (source: Iterable<T> | AsyncIterable<T>, sorter: CompareFunction<T>): AsyncGenerator<T, void, undefined>
function sort <T> (source: Iterable<T> | AsyncIterable<T>, sorter: CompareFunction<T>): AsyncGenerator<T, void, undefined> | Generator<T, void, undefined> {
  if (isAsyncIterable(source)) {
    return (async function * () {
      const arr = await all(source)

      yield * arr.sort(sorter)
    })()
  }

  return (function * () {
    const arr = all(source)

    yield * arr.sort(sorter)
  })()
}

export default sort
