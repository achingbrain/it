/**
 * @packageDocumentation
 *
 * Filter values out of an (async)iterable
 *
 * @example
 *
 * ```javascript
 * import all from 'it-all'
 * import filter from 'it-filter'
 *
 * // This can also be an iterator, generator, etc
 * const values = [0, 1, 2, 3, 4]
 *
 * const fn = val => val > 2 // Return boolean to keep item
 *
 * const arr = all(filter(values, fn))
 *
 * console.info(arr) // 3, 4
 * ```
 *
 * Async sources and filter functions must be awaited:
 *
 * ```javascript
 * import all from 'it-all'
 * import filter from 'it-filter'
 *
 * const values = async function * () {
 *   yield * [0, 1, 2, 3, 4]
 * }
 *
 * const fn = async val => val > 2 // Return boolean or promise of boolean to keep item
 *
 * const arr = await all(filter(values, fn))
 *
 * console.info(arr) // 3, 4
 * ```
 */

import peek from 'it-peekable'

function isAsyncIterable <T> (thing: any): thing is AsyncIterable<T> {
  return thing[Symbol.asyncIterator] != null
}

/**
 * Filters the passed (async) iterable by using the filter function
 */
function filter <T> (source: Iterable<T>, fn: (val: T) => Promise<boolean>): AsyncGenerator<T, void, undefined>
function filter <T> (source: Iterable<T>, fn: (val: T) => boolean): Generator<T, void, undefined>
function filter <T> (source: Iterable<T> | AsyncIterable<T>, fn: (val: T) => boolean | Promise<boolean>): AsyncGenerator<T, void, undefined>
function filter <T> (source: Iterable<T> | AsyncIterable<T>, fn: (val: T) => boolean | Promise<boolean>): Generator<T, void, undefined> | AsyncGenerator<T, void, undefined> {
  if (isAsyncIterable(source)) {
    return (async function * () {
      for await (const entry of source) {
        if (await fn(entry)) {
          yield entry
        }
      }
    })()
  }

  // if mapping function returns a promise we have to return an async generator
  const peekable = peek(source)
  const { value, done } = peekable.next()

  if (done === true) {
    return (function * () {}())
  }

  const res = fn(value)

  // @ts-expect-error .then is not present on O
  if (typeof res.then === 'function') {
    return (async function * () {
      if (await res) {
        yield value
      }

      for await (const entry of peekable) {
        if (await fn(entry)) {
          yield entry
        }
      }
    })()
  }

  const func = fn as (val: T) => boolean

  return (function * () {
    if (res === true) {
      yield value
    }

    for (const entry of peekable) {
      if (func(entry)) {
        yield entry
      }
    }
  })()
}

export default filter
