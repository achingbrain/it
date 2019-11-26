'use strict'

const all = async (iterator) => {
  const arr = []

  for await (const entry of iterator) {
    arr.push(entry)
  }

  return arr
}

module.exports = all
