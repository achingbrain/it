'use strict'

/**
 * Consumes the passed iterator and returns the number of items it contained.
 *
 * @param {AsyncIterable<any> | Iterable<any>} iterator
 * @returns {Promise<number>}
 */
const length = async (iterator) => {
  let count = 0

  for await (const _ of iterator) { // eslint-disable-line no-unused-vars
    count++
  }

  return count
}

module.exports = length
