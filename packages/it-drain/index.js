'use strict'

const drain = async (iterator) => {
  for await (const _ of iterator) { } // eslint-disable-line no-unused-vars
}

module.exports = drain
