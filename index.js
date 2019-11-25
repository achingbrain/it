'use strict'

const batch = require('it-batch')

async function * parallelBatch (source, size) {
  for await (const things of batch(source, size)) {
    const results = await Promise.all(
      things.map(thing => thing())
    )

    yield * results
  }
}

module.exports = parallelBatch
