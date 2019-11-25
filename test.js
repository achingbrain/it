import batch from './'
import test from 'ava'
import all from 'it-all'

test('Should batch up entries', async (t) => {
  async function * iterator (values) {
    yield * values
  }

  const vals = [0, 1, 2, 3, 4]
  const res = await all(batch(iterator(vals), 2))

  t.deepEqual(res, [[0, 1], [2, 3], [4]])
})
