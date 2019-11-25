import toArray from './'
import test from 'ava'

test('Should collect all entries of an async iterator as an array', async (t) => {
  async function * iterator (values) {
    yield * values
  }

  const vals = [0, 1, 2, 3, 4]

  const arr = await toArray(iterator(vals))

  t.deepEqual(arr, vals)
})
