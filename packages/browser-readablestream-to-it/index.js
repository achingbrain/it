'use strict'

async function * browserReadableStreamToIt (stream) {
  const reader = stream.getReader()

  while (true) {
    const result = await reader.read()

    if (result.done) {
      return
    }

    yield result.value
  }
}

module.exports = browserReadableStreamToIt
