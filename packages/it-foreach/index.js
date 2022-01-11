'use strict'

/**
 * Invokes the passed function for each item in an iterable
 *
 * @template T
 * @param {AsyncIterable<T>|Iterable<T>} source
 * @param {(thing: T) => void | Promise<void>} fn
 */
const each = async function * (source, fn) {
  for await (const thing of source) {
    await fn(thing)
    yield thing
  }
}

module.exports = each
