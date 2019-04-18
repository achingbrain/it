'use strict'

const first = async (iterator) => {
  for await (const entry of iterator) {
    return entry
  }
}

module.exports = first
