'use strict'

const map = async function * (iterator, func) {
  for await (const val of iterator) {
    yield func(val)
  }
}

module.exports = map
