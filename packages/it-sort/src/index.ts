'use strict'

const all = require('it-all')

/**
 * Collects all values from an async iterator, sorts them
 * using the passed function and yields them
 *
 * @template T
 * @param {AsyncIterable<T> | Iterable<T>} source
 * @param {(a: T, b: T) => -1 | 0 | 1} sorter
 */
const sort = async function * (source, sorter) {
  const arr = await all(source)

  yield * arr.sort(sorter)
}

module.exports = sort
