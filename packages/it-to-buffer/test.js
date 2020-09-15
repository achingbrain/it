const toBuffer = require('./')
const test = require('ava')

test('Should turn a generator that yields buffers into a buffer', async (t) => {
  const iter = function * () {
    yield Buffer.from([0])
    yield Buffer.from([1])
    yield Buffer.from([2])
  }

  const result = await toBuffer(iter())

  t.deepEqual(result, Buffer.from([0, 1, 2]))
})

test('Should turn an array buffers into a buffer', async (t) => {
  const result = await toBuffer([
    Buffer.from([0]),
    Buffer.from([1]),
    Buffer.from([2])
  ])

  t.deepEqual(result, Buffer.from([0, 1, 2]))
})
