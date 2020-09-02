'use strict'

/**
 * Drains an (async) iterable discarding its' content and does not return
 * anything.
 *
 * @template T
 * @param {AsyncIterable<T>|Iterable<T>} source
 * @returns {Promise<void>}
 */
const drain = async (source) => {
  for await (const _ of source) { } // eslint-disable-line no-unused-vars
}

module.exports = drain
