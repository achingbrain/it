'use strict'

/**
 * Reduces the values yielded by an (async) iterable
 *
 * @template T, V
 * @param {AsyncIterable<T>|Iterable<T>} source
 * @param {function(V, T):V} func
 * @param {V} init
 */
const reduce = async (source, func, init) => {
  for await (const val of source) {
    init = func(init, val)
  }

  return init
}

module.exports = reduce
