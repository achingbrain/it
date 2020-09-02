'use strict'

/**
 * Returns the last item of an (async) iterable, unless empty, in which case
 * return `void`.
 *
 * @template T
 * @param {AsyncIterable<T>|Iterable<T>} source
 * @returns {Promise<T|void>}
 */
const last = async (source) => {
  /** @type {T|void} */
  let res

  for await (const entry of source) {
    res = entry
  }

  return res
}

module.exports = last
