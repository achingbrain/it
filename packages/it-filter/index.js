'use strict'

const filter = async function * (iterator, fn) {
  for await (const entry of iterator) {
    if (await fn(entry)) {
      yield entry
    }
  }
}

module.exports = filter
