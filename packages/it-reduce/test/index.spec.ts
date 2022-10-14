const reduce = require('./')
const test = require('ava')

test('Should reduce the values yielded from an async iterator', async (t) => {
  const iter = function * () {
    yield 1
    yield 2
    yield 3
  }

  const result = await reduce(iter(), (acc, curr) => acc + curr, 0)

  t.is(result, 6)
})
