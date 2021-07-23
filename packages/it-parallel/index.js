'use strict'

const defer = require('p-defer')
const EventEmitter = require('events').EventEmitter

/**
 * Takes an (async) iterator that emits promise-returning functions,
 * invokes them in parallel and emits the results as they become available but
 * in the same order as the input
 *
 * @template T
 * @param {Iterable<() => Promise<T>> | AsyncIterable<() => Promise<T>>} source
 * @param {number} [concurrency=1]
 * @returns {AsyncIterable<T>}
 */
async function * parallel (source, concurrency = 1) {
  if (concurrency < 1) {
    concurrency = 1
  }

  const emitter = new EventEmitter()

  /** @type {any[]} */
  const ops = []
  let slotAvailable = defer()
  let sourceFinished = false

  let resultAvailable = defer()

  emitter.on('task-complete', () => {
    resultAvailable.resolve()
    resultAvailable = defer()
  })

  Promise.resolve().then(async () => {
    try {
      for await (const task of source) {
        if (ops.length === concurrency) {
          await slotAvailable.promise
        }

        /**
         * @type {any}
         */
        const op = {
          done: false
        }
        ops.push(op)

        task()
          .then(result => {
            op.done = true
            op.ok = true
            op.value = result
            emitter.emit('task-complete')
          }, err => {
            op.done = true
            op.err = err
            emitter.emit('task-complete')
          })
      }

      sourceFinished = true
    } catch (err) {
      emitter.emit('task-complete')
    }
  })

  while (true) {
    await resultAvailable.promise

    while (ops.length && ops[0].done) {
      const op = ops[0]
      ops.shift()

      if (op.ok) {
        yield op.value
      } else {
        throw op.err
      }

      slotAvailable.resolve()
      slotAvailable = defer()
    }

    if (sourceFinished && ops.length === 0) {
      // not waiting for any results and no more tasks so we are done
      break
    }
  }
}

module.exports = parallel
