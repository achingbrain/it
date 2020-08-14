'use strict'

const length = async (iterator) => {
  let count = 0

  for await (const _ of iterator) { // eslint-disable-line no-unused-vars
    count++
  }

  return count
}

module.exports = length
