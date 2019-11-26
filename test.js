import batch from './'
import test from 'ava'
import all from 'it-all'

test('Should batch up entries', async (t) => {
  const values = [0, 1, 2, 3, 4]
  const batchSize = 2
  const res = await all(batch(values, batchSize))

  t.deepEqual(res, [[0, 1], [2, 3], [4]])
})

test('Should batch up entries without batch size', async (t) => {
  const values = [0, 1, 2, 3, 4]
  const res = await all(batch(values))

  t.deepEqual(res, [[0], [1], [2], [3], [4]])
})
