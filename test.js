import batch from './'
import test from 'ava'
import all from 'it-all'

test('Should batch up emitted arrays', async (t) => {
  const values = [[0, 1, 2], [3], [4]]
  const res = await all(batch(values, 2))

  t.deepEqual(res, [[0, 1], [2, 3], [4]])
})

test('Should batch up emitted arrays in singles', async (t) => {
  const values = [[0, 1, 2], [3], [4]]
  const res = await all(batch(values, 1))

  t.deepEqual(res, [[0], [1], [2], [3], [4]])
})

test('Should batch up emitted arrays in one array', async (t) => {
  const values = [[0, 1, 2], [3], [4]]
  const res = await all(batch(values, 100))

  t.deepEqual(res, [[0, 1, 2, 3, 4]])
})

test('Should batch up emitted arrays in small arrays', async (t) => {
  const values = [[0, 1, 2, 3, 4], [5, 6, 7, 8, 9, 10]]
  const res = await all(batch(values, 1))

  t.deepEqual(res, [[0], [1], [2], [3], [4], [5], [6], [7], [8], [9], [10]])
})

test('Should batch up emitted arrays in one array when Infinty is passed as max', async (t) => {
  const values = [[0, 1, 2], [3], [4]]
  const res = await all(batch(values, Infinity))

  t.deepEqual(res, [[0, 1, 2, 3, 4]])
})

test('Should batch up emitted arrays when no batch size is passed', async (t) => {
  const values = [[0, 1, 2], [3], [4]]
  const res = await all(batch(values))

  t.deepEqual(res, [[0], [1], [2], [3], [4]])
})
