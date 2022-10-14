const split = require('./')
const all = require('it-all')
const test = require('ava')
const { toString } = require('uint8arrays/to-string')

test('Should split Uint8Arrays by newlines', async (t) => {
  const encoder = new TextEncoder()
  const values = [
    encoder.encode('hello\nwor'),
    encoder.encode('ld')
  ]

  const res = await all(split(values))

  t.deepEqual(res.map(buf => toString(buf)), [
    'hello',
    'world'
  ])
})

test('Should split Uint8Arrays by arbitrary delimiters', async (t) => {
  const values = [
    Uint8Array.from([0, 1, 2, 3]),
    Uint8Array.from([0, 1, 2, 3]),
    Uint8Array.from([1, 1, 2])
  ]
  const delimiter = Uint8Array.from([1, 2])

  const res = await all(split(values, {
    delimiter
  }))

  t.deepEqual(res, [
    Buffer.from([0]),
    Buffer.from([3, 0]),
    Buffer.from([3, 1])
  ])
})
