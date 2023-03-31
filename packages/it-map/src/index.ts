import peek from 'it-peekable'

function isAsyncIterable <T> (thing: any): thing is AsyncIterable<T> {
  return thing[Symbol.asyncIterator] != null
}

/**
 * Takes an (async) iterable and returns one with each item mapped by the passed
 * function
 */
function map <I, O> (source: Iterable<I>, func: (val: I) => Promise<O>): AsyncGenerator<O, void, undefined>
function map <I, O> (source: Iterable<I>, func: (val: I) => O): Generator<O, void, undefined>
function map <I, O> (source: AsyncIterable<I> | Iterable<I>, func: (val: I) => O | Promise<O>): AsyncGenerator<O, void, undefined>
function map <I, O> (source: AsyncIterable<I> | Iterable<I>, func: (val: I) => O | Promise<O>): AsyncGenerator<O, void, undefined> | Generator<O, void, undefined> {
  if (isAsyncIterable(source)) {
    return (async function * () {
      for await (const val of source) {
        yield func(val)
      }
    })()
  }

  // if mapping function returns a promise we have to return an async generator
  const peekable = peek(source)
  const { value, done } = peekable.next()

  if (done === true) {
    return (function * () {}())
  }

  const res = func(value)

  // @ts-expect-error .then is not present on O
  if (typeof res.then === 'function') {
    return (async function * () {
      yield await res

      for await (const val of peekable) {
        yield func(val)
      }
    })()
  }

  const fn = func as (val: I) => O

  return (function * () {
    yield res as O

    for (const val of peekable) {
      yield fn(val)
    }
  })()
}

export default map
