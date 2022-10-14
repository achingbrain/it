const sort = require('./')
const all = require('it-all')
const test = require('ava')

test('Should sort all entries of an array', async (t) => {
  const values = ['foo', 'bar']
  const sorter = (a, b) => {
    return a.localeCompare(b)
  }

  const res = await all(sort(values, sorter))

  t.deepEqual(res, ['bar', 'foo'])
})
