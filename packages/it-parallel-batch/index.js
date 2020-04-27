'use strict'

const batch = require('it-batch')

async function * parallelBatch (source, size) {
  size = parseInt(size)

  if (isNaN(size) || size < 1) {
    size = 1
  }

  for await (let things of batch(source, size)) {
    things = things.map(p => {
      return p().then(res => ({ res }), err => ({ err }))
    })

    for (let i = 0; i < things.length; i++) {
      const { res, err } = await things[i]

      if (err) {
        throw err
      }

      yield res
    }
  }
}

module.exports = parallelBatch
