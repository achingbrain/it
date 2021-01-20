const skip = require('./')
const all = require('it-all')
const test = require('ava')

test('Should skip values from an iterable', async (t) => {
  const values = [0, 1, 2, 3, 4]

  const res = await all(skip(values, 2))

  t.deepEqual(res, [2, 3, 4])
})
