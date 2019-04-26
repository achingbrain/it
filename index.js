'use strict'

async function * batch (source, size) {
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
