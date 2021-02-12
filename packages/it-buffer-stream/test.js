const bufferStream = require('./')
const test = require('ava')
const { Buffer } = require('buffer')

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
  let emitted = Buffer.alloc(0)
  const buffers = []

  for await (const buf of bufferStream(expected, {
    collector: (buffer) => {
      emitted = Buffer.concat([emitted, buffer])
    }
  })) {
    buffers.push(buf)
  }

  t.deepEqual(emitted, buffers[0])
})

test('Should allow generation of buffers', async (t) => {
  const expected = 100
  let emitted = Buffer.alloc(0)
  const buffers = []

  for await (const buf of bufferStream(expected, {
    generator: (size) => {
      const output = Buffer.alloc(size, 1)
      emitted = Buffer.concat([emitted, output])

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
