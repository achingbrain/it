import last from './'
import test from 'ava'

test('Should return only the last result from an async iterator', async (t) => {
  async function * iterator (values) {
    yield * values
  }

  const vals = [0, 1, 2, 3, 4]

  const res = await last(iterator(vals))

  t.is(res, 4)
})
