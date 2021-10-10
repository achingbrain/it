'use strict'

const parallel = require('./')
const test = require('ava')
const all = require('it-all')
const delay = require('delay')

const createFn = (ms, result) => {
  return async () => {
    await delay(ms)

    return result
  }
}

test('Should execute and return ordered results', async (t) => {
  const input = [
    createFn(1000, 1),
    createFn(2000, 2),
    createFn(100, 3),
    createFn(500, 4)
  ]

  const res = await all(parallel(input, {
    concurrency: 3,
    ordered: true
  }))

  t.deepEqual(res, [1, 2, 3, 4])
})

test('Should execute and return unordered results', async (t) => {
  const input = [
    createFn(1000, 1),
    createFn(2000, 2),
    createFn(100, 3),
    createFn(500, 4)
  ]

  const res = await all(parallel(input, {
    concurrency: 3,
    ordered: false
  }))

  t.deepEqual(res, [3, 4, 1, 2])
})

test('Should not exceed concurrency limit', async (t) => {
  let running = 0
  let runningMax = 0
  const concurrency = 3

  const createFn = (ms, result) => {
    return async () => {
      running++

      if (running > runningMax) {
        runningMax = running
      }

      await delay(ms)

      running--

      return result
    }
  }

  const input = [
    createFn(1000, 1),
    createFn(100, 2),
    createFn(100, 3),
    createFn(10, 4),
    createFn(10, 5)
  ]

  const res = await all(parallel(input, { concurrency, ordered: true }))

  t.deepEqual(res, [1, 2, 3, 4, 5])

  t.is(runningMax, concurrency)
})

test('Should propagate task errors', async (t) => {
  const error = new Error('wat')

  const input = [
    createFn(100, 1),
    async () => {
      await delay(200)

      throw error
    },
    createFn(50, 3)
  ]

  try {
    await all(parallel(input, { concurrency: 2 }))
  } catch (err) {
    t.is(err, error)
  }
})

test('Should propagate source errors', async (t) => {
  const error = new Error('Urk!')

  async function * source () {
    yield async () => 'foo'

    throw error
  }

  try {
    await all(parallel(source(), { concurrency: 2 }))
  } catch (err) {
    t.is(err, error)
  }
})

test('Should allow source to finish if task errors', async (t) => {
  let sourceFinished = false
  let index = 0
  const values = [
    async () => {
      await delay(500)
      throw new Error('Urk!')
    },
    async () => {
      await delay(100)
      return 'hello'
    },
    async () => {
      await delay(200)
      return 'hello'
    },
    async () => {
      await delay(300)
      return 'hello'
    },
    async () => {
      await delay(400)
      return 'hello'
    },
    async () => {
      await delay(500)
      return 'world'
    },
    async () => {
      await delay(600)
      return 'world'
    }
  ]

  const source = {
    [Symbol.asyncIterator]: () => source,
    async next () {
      const value = values[index]
      index++

      return Promise.resolve({
        done: index === values.length,
        value
      })
    },
    return () {
      sourceFinished = true
    }
  }

  try {
    await all(parallel(source, { concurrency: 2, ordered: true }))
  } catch {
    t.truthy(sourceFinished)
  }
})

test('Should work without concurrency parameter', async (t) => {
  const input = [
    createFn(200, 1),
    createFn(100, 2)
  ]

  const res = await all(parallel(input, { ordered: true }))

  t.deepEqual(res, [1, 2])
})

test('Should batch up entries with negative batch size', async (t) => {
  const input = [
    createFn(200, 1),
    createFn(100, 2)
  ]
  const concurrency = -1
  const res = await all(parallel(input, { concurrency, ordered: true }))

  t.deepEqual(res, [1, 2])
})

test('Should batch up entries with zero batch size', async (t) => {
  const input = [
    createFn(200, 1),
    createFn(100, 2)
  ]
  const concurrency = 0
  const res = await all(parallel(input, { concurrency, ordered: true }))

  t.deepEqual(res, [1, 2])
})

test('Should batch up entries with string batch size', async (t) => {
  const input = [
    createFn(200, 1),
    createFn(100, 2)
  ]
  const concurrency = '2'
  const res = await all(parallel(input, { concurrency, ordered: true }))

  t.deepEqual(res, [1, 2])
})

test('Should batch up entries with non-integer batch size', async (t) => {
  const input = [
    createFn(200, 1),
    createFn(100, 2)
  ]
  const concurrency = 2.5
  const res = await all(parallel(input, { concurrency, ordered: true }))

  t.deepEqual(res, [1, 2])
})

test('Should allow returning errors', async (t) => {
  const input = [
    async () => {
      await delay(200)

      return new Error('herp')
    },
    async () => {
      await delay(100)

      return new Error('derp')
    }
  ]
  const concurrency = 2
  const res = await all(parallel(input, { concurrency, ordered: true }))

  t.deepEqual(res, [new Error('herp'), new Error('derp')])
})

test('Should work with empty source', async (t) => {
  const input = []
  const res = await all(parallel(input))

  t.deepEqual(res, [])
})
