'use strict'

const pushable = require('it-pushable')

/**
 * Treat one or more iterables as a single iterable.
 *
 * Nb. sources are iterated over in parallel so the
 * order of emitted items is not guaranteed.
 *
 * @template T
 * @param {...AsyncIterable<T>|Iterable<T>} sources
 * @returns {AsyncIterable<T>}
 */
const merge = async function * (...sources) {
  const output = pushable()

  setTimeout(async () => {
    try {
      await Promise.all(
        sources.map(async (source) => {
          for await (const item of source) {
            output.push(item)
          }
        })
      )

      output.end()
    } catch (/** @type {any} */ err) {
      output.end(err)
    }
  }, 0)

  yield * output
}

module.exports = merge
