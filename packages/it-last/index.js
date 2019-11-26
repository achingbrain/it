'use strict'

const last = async (iterator) => {
  let res

  for await (const entry of iterator) {
    res = entry
  }

  return res
}

module.exports = last
