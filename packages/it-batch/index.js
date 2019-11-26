'use strict'

async function * batch (source, size) {
  size = parseInt(size)

  if (isNaN(size) || size < 1) {
    size = 1
  }

  let things = []

  for await (const thing of source) {
    things.push(thing)

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
