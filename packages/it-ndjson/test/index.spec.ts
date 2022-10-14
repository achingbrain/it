const test = require('ava')
const ndjson = require('.')
const { Buffer } = require('buffer')
import all from 'it-all'

/**
 * @template T
 * @param {T[]} array
 * @returns {AsyncIterable<T>}
 */
async function * toAsyncIterator (array) {
  for (let i = 0; i < array.length; i++) {
    yield new Promise(resolve => setTimeout(() => resolve(array[i])))
  }
}

/**
 * @param {string} str
 */
function toUint8Array (str) {
  const arr = new Uint8Array(str.length)
  for (let i = 0; i < str.length; i++) {
    arr[i] = str.charCodeAt(i)
  }
  return arr
}

test('should split 1 item from 1 chunk', async t => {
  const source = toAsyncIterator(['{ "id": 1 }\n'])
  const results = await all(ndjson.parse(source))

  t.deepEqual(results, [{ id: 1 }])
})

test('should split 1 item from 2 chunks', async t => {
  const source = toAsyncIterator(['{ "id', '": 1 }\n'])
  const results = await all(ndjson.parse(source))

  t.deepEqual(results, [{ id: 1 }])
})

test('should split 2 items from 2 chunks', async t => {
  const source = toAsyncIterator(['{ "id": 1 }\n', '{ "id": 2 }'])
  const results = await all(ndjson.parse(source))

  t.deepEqual(results, [{ id: 1 }, { id: 2 }])
})

test('should split 2 items from 1 chunk', async t => {
  const source = toAsyncIterator(['{ "id": 1 }\n{ "id": 2 }'])
  const results = await all(ndjson.parse(source))

  t.deepEqual(results, [{ id: 1 }, { id: 2 }])
})

test('should split 3 items from 2 chunks', async t => {
  const source = toAsyncIterator(['{ "id": 1 }\n{ "i', 'd": 2 }', '\n{"id":3}'])
  const results = await all(ndjson.parse(source))

  t.deepEqual(results, [{ id: 1 }, { id: 2 }, { id: 3 }])
})

test('should split from Buffers', async t => {
  const source = toAsyncIterator([Buffer.from('{ "id": 1 }\n{ "i'), Buffer.from('d": 2 }'), Buffer.from('\n{"id":3}')])
  const results = await all(ndjson.parse(source))
  t.deepEqual(results, [{ id: 1 }, { id: 2 }, { id: 3 }])
})

test('should split from Uint8Arrays', async t => {
  const source = toAsyncIterator([toUint8Array('{ "id": 1 }\n{ "i'), toUint8Array('d": 2 }'), toUint8Array('\n{"id":3}')])
  const results = await all(ndjson.parse(source))

  t.deepEqual(results, [{ id: 1 }, { id: 2 }, { id: 3 }])
})

test('should round trip', async t => {
  const input = '{"id":1}\n{"id":2}\n{"id":3}\n'
  const source = toAsyncIterator([input])
  const results = await all(ndjson.stringify(ndjson.parse(source)))

  t.is(results.join(''), input)
})

test('should stringify trip', async t => {
  const input = [{ id: 1 }, { id: 2 }, { id: 3 }]
  const source = toAsyncIterator(input)
  const results = await all(ndjson.stringify(source))

  t.is(results.join(''), '{"id":1}\n{"id":2}\n{"id":3}\n')
})
