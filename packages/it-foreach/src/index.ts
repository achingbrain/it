import peek from 'it-peekable'

function isAsyncIterable <T> (thing: any): thing is AsyncIterable<T> {
  return thing[Symbol.asyncIterator] != null
}

function isPromise <T = unknown> (thing: any): thing is Promise<T> {
  return thing?.then != null
}

/**
 * Invokes the passed function for each item in an iterable
 */
function forEach <T> (source: Iterable<T>, fn: (thing: T) => Promise<void>): AsyncGenerator<T, void, undefined>
function forEach <T> (source: Iterable<T>, fn: (thing: T) => void): Generator<T, void, undefined>
function forEach <T> (source: Iterable<T> | AsyncIterable<T>, fn: (thing: T) => void | Promise<void>): AsyncGenerator<T, void, undefined>
function forEach <T> (source: Iterable<T> | AsyncIterable<T>, fn: (thing: T) => void | Promise<void>): AsyncGenerator<T, void, undefined> | Generator<T, void, undefined> {
  if (isAsyncIterable(source)) {
    return (async function * () {
      for await (const val of source) {
        const res = fn(val)

        if (isPromise(res)) {
          await res
        }

        yield val
      }
    })()
  }

  // if fn function returns a promise we have to return an async generator
  const peekable = peek(source)
  const { value, done } = peekable.next()

  if (done === true) {
    return (function * () {}())
  }

  const res = fn(value)

  if (typeof res?.then === 'function') {
    return (async function * () {
      yield value

      for await (const val of peekable) {
        const res = fn(val)

        if (isPromise(res)) {
          await res
        }

        yield val
      }
    })()
  }

  const func = fn as (val: T) => void

  return (function * () {
    yield value

    for (const val of peekable) {
      func(val)
      yield val
    }
  })()
}

export default forEach
