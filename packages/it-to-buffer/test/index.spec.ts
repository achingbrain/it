const toBuffer = require('./')
const test = require('ava')

test('Should turn a generator that yields buffers into a buffer', async (t) => {
  const iter = function * () {
    yield Uint8Array.from([0])
    yield Uint8Array.from([1])
    yield Uint8Array.from([2])
  }

  const result = await toBuffer(iter())

  t.deepEqual(result, Uint8Array.from([0, 1, 2]))
})

test('Should turn an array buffers into a buffer', async (t) => {
  const result = await toBuffer([
    Uint8Array.from([0]),
    Uint8Array.from([1]),
    Uint8Array.from([2])
  ])

  t.deepEqual(result, Uint8Array.from([0, 1, 2]))
})
