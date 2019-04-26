import batch from './'
import test from 'ava'
import all from 'async-iterator-all'

test('Should batch up emitted arrays', async (t) => {
  async function * iterator (values) {
    for (let i = 0; i < values.length; i++) {
      yield values[i]
    }
  }

  const vals = [[0, 1, 2], [3], [4]]
  const res = await all(batch(iterator(vals), 2))

  t.deepEqual(res, [[0, 1], [2, 3], [4]])
})

test('Should batch up emitted arrays in singles', async (t) => {
  async function * iterator (values) {
    for (let i = 0; i < values.length; i++) {
      yield values[i]
    }
  }

  const vals = [[0, 1, 2], [3], [4]]
  const res = await all(batch(iterator(vals), 1))

  t.deepEqual(res, [[0], [1], [2], [3], [4]])
})

test('Should batch up emitted arrays in one array', async (t) => {
  async function * iterator (values) {
    for (let i = 0; i < values.length; i++) {
      yield values[i]
    }
  }

  const vals = [[0, 1, 2], [3], [4]]
  const res = await all(batch(iterator(vals), 100))

  t.deepEqual(res, [[0, 1, 2, 3, 4]])
})

test('Should batch up emitted arrays in small arrays', async (t) => {
  async function * iterator (values) {
    for (let i = 0; i < values.length; i++) {
      yield values[i]
    }
  }

  const vals = [[0, 1, 2, 3, 4], [5, 6, 7, 8, 9, 10]]
  const res = await all(batch(iterator(vals), 1))

  t.deepEqual(res, [[0], [1], [2], [3], [4], [5], [6], [7], [8], [9], [10]])
})
