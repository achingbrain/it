import first from './'
import test from 'ava'

test('Should return only the first result from an async iterator', async (t) => {
  async function * iterator (values) {
    for (let i = 0; i < values.length; i++) {
      yield values[i]
    }
  }

  const vals = [0, 1, 2, 3, 4]

  const res = await first(iterator(vals))

  t.is(res, 0)
})
