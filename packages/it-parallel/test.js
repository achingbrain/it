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

test('Should execute', async (t) => {
  const input = [
    createFn(1000, 1),
    createFn(2000, 2),
    createFn(100, 3),
    createFn(100, 4)
  ]

  const res = await all(parallel(input, 3))

  t.deepEqual(res, [1, 2, 3, 4])
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

  const res = await all(parallel(input, concurrency))

  t.deepEqual(res, [1, 2, 3, 4, 5])

  t.is(runningMax, concurrency)
})

test('Should propagate errors', async (t) => {
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
    await all(parallel(input, 2))
  } catch (err) {
    t.is(err, error)
  }
})

test('Should work without size parameter', async (t) => {
  const input = [
    createFn(200, 1),
    createFn(100, 2)
  ]

  const res = await all(parallel(input))

  t.deepEqual(res, [1, 2])
})

test('Should batch up entries with negative batch size', async (t) => {
  const input = [
    createFn(200, 1),
    createFn(100, 2)
  ]
  const batchSize = -1
  const res = await all(parallel(input, batchSize))

  t.deepEqual(res, [1, 2])
})

test('Should batch up entries with zero batch size', async (t) => {
  const input = [
    createFn(200, 1),
    createFn(100, 2)
  ]
  const batchSize = 0
  const res = await all(parallel(input, batchSize))

  t.deepEqual(res, [1, 2])
})

test('Should batch up entries with string batch size', async (t) => {
  const input = [
    createFn(200, 1),
    createFn(100, 2)
  ]
  const batchSize = '2'
  const res = await all(parallel(input, batchSize))

  t.deepEqual(res, [1, 2])
})

test('Should batch up entries with non-integer batch size', async (t) => {
  const input = [
    createFn(200, 1),
    createFn(100, 2)
  ]
  const batchSize = 2.5
  const res = await all(parallel(input, batchSize))

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
  const batchSize = 2
  const res = await all(parallel(input, batchSize))

  t.deepEqual(res, [new Error('herp'), new Error('derp')])
})
