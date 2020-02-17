'use strict'

const reduce = async (iterator, func, init) => {
  for await (const val of iterator) {
    init = func(init, val)
  }

  return init
}

module.exports = reduce
