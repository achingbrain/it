const each = require('./')
const all = require('it-all')
const test = require('ava')

test('Should iterate over every value', async (t) => {
  const values = [0, 1, 2, 3, 4]
  let sum = 0

  const res = await all(each(values, (val) => {
    sum += val
  }))

  t.deepEqual(res, values)
  t.is(10, sum)
})

test('Should abort source', async (t) => {
  const values = [0, 1, 2, 3, 4]
  let sum = 0
  const err = new Error('wat')

  try {
    await all(each(values, (val) => {
      sum += val

      if (val === 3) {
        throw err
      }
    }))

    throw new Error('Did not abort')
  } catch (e) {
    t.is(e, err)
    t.is(6, sum)
  }
})
