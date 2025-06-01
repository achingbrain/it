/**
 * @packageDocumentation
 *
 * Calls a function for each value in an (async)iterable.
 *
 * The function can be sync or async.
 *
 * Async functions can be awaited on so may slow down processing of the (async)iterable.
 *
 * @example
 *
 * ```javascript
 * import each from 'it-foreach'
 * import drain from 'it-drain'
 *
 * // This can also be an iterator, generator, etc
 * const values = [0, 1, 2, 3, 4]
 *
 * // prints [0, 0], [1, 1], [2, 2], [3, 3], [4, 4]
 * const arr = drain(
 *   each(values, console.info)
 * )
 * ```
 *
 * Async sources and callbacks must be awaited:
 *
 * ```javascript
 * import each from 'it-foreach'
 * import drain from 'it-drain'
 *
 * const values = async function * () {
 *   yield * [0, 1, 2, 3, 4]
 * }
 *
 * // prints [0, 0], [1, 1], [2, 2], [3, 3], [4, 4]
 * const arr = await drain(
 *   each(values(), console.info)
 * )
 * ```
 */

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
function forEach <T> (source: Iterable<T>, fn: (thing: T, index: number) => Promise<void>): AsyncGenerator<T, void, undefined>
function forEach <T> (source: Iterable<T>, fn: (thing: T, index: number) => void): Generator<T, void, undefined>
function forEach <T> (source: Iterable<T> | AsyncIterable<T>, fn: (thing: T, index: number) => void | Promise<void>): AsyncGenerator<T, void, undefined>
function forEach <T> (source: Iterable<T> | AsyncIterable<T>, fn: (thing: T, index: number) => void | Promise<void>): AsyncGenerator<T, void, undefined> | Generator<T, void, undefined> {
  let index = 0

  if (isAsyncIterable(source)) {
    return (async function * () {
      for await (const val of source) {
        const res = fn(val, index++)

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

  const res = fn(value, index++)

  if (typeof res?.then === 'function') {
    return (async function * () {
      yield value

      for (const val of peekable) {
        const res = fn(val, index++)

        if (isPromise(res)) {
          await res
        }

        yield val
      }
    })()
  }

  const func = fn as (val: T, index: number) => void

  return (function * () {
    yield value

    for (const val of peekable) {
      func(val, index++)
      yield val
    }
  })()
}

export default forEach
