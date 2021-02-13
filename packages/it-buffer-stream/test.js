const bufferStream = require('./')
const test = require('ava')
const uint8ArrayConcat = require('uint8arrays/concat')

test('Should emit bytes', async (t) => {
  const expected = 100
  const buffers = []

  for await (const buf of bufferStream(expected)) {
    buffers.push(buf)
  }

  t.is(buffers.length, 1)
  t.is(buffers[0].length, expected)
})

test('Should emit a number of buffers', async (t) => {
  const expected = 100
  const chunkSize = 10
  const buffers = []

  for await (const buf of bufferStream(expected, {
    chunkSize
  })) {
    buffers.push(buf)
  }

  t.is(buffers.length, 10)
  t.is(buffers[0].length, expected / chunkSize)

  const total = buffers.reduce((acc, cur) => acc + cur.length, 0)

  t.is(expected, total)
})

test('Should allow collection of buffers', async (t) => {
  const expected = 100
  let emitted = new Uint8Array(0)
  const buffers = []

  for await (const buf of bufferStream(expected, {
    collector: (buffer) => {
      emitted = uint8ArrayConcat([emitted, buffer])
    }
  })) {
    buffers.push(buf)
  }

  t.deepEqual(Uint8Array.from(emitted), Uint8Array.from(buffers[0]))
})

test('Should allow generation of buffers', async (t) => {
  const expected = 100
  let emitted = new Uint8Array(0)
  const buffers = []

  for await (const buf of bufferStream(expected, {
    generator: (size) => {
      const output = new Uint8Array(size)
      emitted = uint8ArrayConcat([emitted, output])

      return output
    }
  })) {
    buffers.push(buf)
  }

  t.deepEqual(emitted, buffers[0])
})

test('Should propagate byte generation errors', async (t) => {
  const generationError = new Error('Urk!')

  try {
    for await (const _ of bufferStream(5, { // eslint-disable-line no-unused-vars
      generator: async () => {
        throw generationError
      }
    })) { // eslint-disable-line no-empty

    }

    throw new Error('No error was thrown')
  } catch (err) {
    t.is(err, generationError)
  }
})
