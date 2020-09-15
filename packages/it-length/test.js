const length = require('./')
const test = require('ava')

test('Should count the items in an async iterator', async (t) => {
  const values = [0, 1, 2, 3, 4]

  const res = await length(values)

  t.is(res, 5)
})
