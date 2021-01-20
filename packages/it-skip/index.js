'use strict'

/**
 * Skip items from an iterable.
 *
 * @template T
 * @param {AsyncIterable<T>|Iterable<T>} source
 * @param {number} offset
 * @returns {AsyncIterable<T>}
 */
const skip = async function * (source, offset) {
  for await (const entry of source) {
    if (offset === 0) {
      yield entry

      continue
    }

    offset--
  }
}

module.exports = skip
