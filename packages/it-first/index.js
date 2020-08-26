'use strict'

/**
 * Returns the first result from an (async) iterable, unless empty, in which
 * case returns `undefined`.
 *
 * @template T
 * @param {AsyncIterable<T>|Iterable<T>} source
 * @returns {Promise<T|void>}
 */
const first = async (source) => {
  for await (const entry of source) {
    return entry
  }
}

module.exports = first
