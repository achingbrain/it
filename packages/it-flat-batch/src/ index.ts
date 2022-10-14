'use strict'

/**
 * Takes an (async) iterable that emits variable length arrays of things and
 * returns an async iterable that emits those things in fixed-size batches.
 *
 * @template T
 * @param {AsyncIterable<T[]>|Iterable<T[]>} source
 * @param {number|string} [batchSize=1]
 * @returns {AsyncIterable<T[]>}
 */
async function * batch (source, batchSize) {
  // @ts-ignore - expects string not a number
  let size = parseInt(batchSize)

  if (isNaN(size) || size < 1) {
    size = 1
  }

  /** @type {T[]} */
  let things = []

  for await (const set of source) {
    things = things.concat(set)

    while (things.length >= size) {
      yield things.slice(0, size)

      things = things.slice(size)
    }
  }

  while (things.length) {
    yield things.slice(0, size)

    things = things.slice(size)
  }
}

module.exports = batch
