'use strict'

const batch = require('it-batch')

async function * parallelBatch (source, size) {
  size = parseInt(size)

  if (isNaN(size) || size < 1) {
    size = 1
  }

  for await (const things of batch(source, size)) {
    const results = []
    let nextResultIndex = 0
    let nextResolve
    let nextResultPromise = new Promise((resolve) => {
      nextResolve = resolve
    })

    things.forEach((thing, index) => {
      thing()
        .then(result => {
          results[index] = result

          nextResolve()
        }, (err) => {
          results[index] = err

          nextResolve()
        })
    })

    while (true) {
      await nextResultPromise

      // yield all available results
      for (let i = nextResultIndex; i < things.length; i++) {
        const result = results[i]

        if (result === undefined) {
          break
        }

        nextResultIndex = i + 1
        results[i] = undefined

        if (result instanceof Error) {
          throw result
        }

        if (result !== undefined) {
          yield result
        }
      }

      if (nextResultIndex === things.length) {
        break
      }

      nextResultPromise = new Promise((resolve) => {
        nextResolve = resolve
      })
    }
  }
}

module.exports = parallelBatch
