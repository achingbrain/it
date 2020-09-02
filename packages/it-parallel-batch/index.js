'use strict'

const batch = require('it-batch')

/**
 * @template T
 * @typedef {function():Promise<T>} Task
 */

/**
 * Takes an (async) iterator that emits promise-returning functions,
 * invokes them in parallel and emits the results as they become available but
 * in the same order as the input
 *
 * @template T
 * @param {AsyncIterable<Task<T>>} source
 * @param {number|string} [size=1]
 * @returns {AsyncIterable<T>}
 */
async function * parallelBatch (source, size) {
  // @ts-ignore - expects string not a number
  size = parseInt(size)

  if (isNaN(size) || size < 1) {
    size = 1
  }

  for await (const tasks of batch(source, size)) {
    /** @type {Promise<{ok:true, value:T}|{ok:false, err:Error}>[]} */
    const things = tasks.map(p => {
      return p().then(value => ({ ok: true, value }), err => ({ ok: false, err }))
    })

    for (let i = 0; i < things.length; i++) {
      const result = await things[i]

      if (result.ok) {
        yield result.value
      } else {
        throw result.err
      }
    }
  }
}

module.exports = parallelBatch
