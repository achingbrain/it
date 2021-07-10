'use strict'

const BufferList = require('bl/BufferList')

/**
 * Splits Uint8Arrays emitted by an (async) iterable by a delimiter
 *
 * @param {AsyncIterable<Uint8Array>|Iterable<Uint8Array>} source
 * @param {object} [options]
 * @param {Uint8Array} [options.delimiter]
 */
const split = async function * (source, options = {}) {
  const bl = new BufferList()
  const delimiter = options.delimiter || new TextEncoder().encode('\n')

  for await (const buf of source) {
    // @ts-ignore Uint8Array type is missing from add signature
    bl.append(buf)

    yield * yieldUntilEnd(bl, delimiter)
  }

  yield * yieldUntilEnd(bl, delimiter)

  if (bl.length) {
    yield bl.slice()
  }
}

/**
 *
 * @param {BufferList} bl
 * @param {Uint8Array} delimiter
 */
async function * yieldUntilEnd (bl, delimiter) {
  let index = bl.indexOf(delimiter)

  while (index !== -1) {
    yield bl.slice(0, index)

    bl.consume(index + delimiter.length)

    index = bl.indexOf(delimiter)
  }
}

module.exports = split
