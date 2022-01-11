const test = require('ava')
const ndjson = require('.')
const { Buffer } = require('buffer')

function toAsyncIterator (array) {
  return (async function * () {
    for (let i = 0; i < array.length; i++) {
      yield new Promise(resolve => setTimeout(() => resolve(array[i])))
    }
  })()
}

function toUint8Array (str) {
  const arr = new Uint8Array(str.length)
  for (let i = 0; i < str.length; i++) {
    arr[i] = str.charCodeAt(i)
  }
  return arr
}

test('should split 1 item from 1 chunk', async t => {
  const source = toAsyncIterator(['{ "id": 1 }\n'])
  const results = []

  for await (const value of ndjson.parse(source)) {
    results.push(value)
  }

  t.deepEqual(results, [{ id: 1 }])
})

test('should split 1 item from 2 chunks', async t => {
  const source = toAsyncIterator(['{ "id', '": 1 }\n'])
  const results = []

  for await (const value of ndjson.parse(source)) {
    results.push(value)
  }

  t.deepEqual(results, [{ id: 1 }])
})

test('should split 2 items from 2 chunks', async t => {
  const source = toAsyncIterator(['{ "id": 1 }\n', '{ "id": 2 }'])
  const results = []

  for await (const value of ndjson.parse(source)) {
    results.push(value)
  }

  t.deepEqual(results, [{ id: 1 }, { id: 2 }])
})

test('should split 2 items from 1 chunk', async t => {
  const source = toAsyncIterator(['{ "id": 1 }\n{ "id": 2 }'])
  const results = []

  for await (const value of ndjson.parse(source)) {
    results.push(value)
  }

  t.deepEqual(results, [{ id: 1 }, { id: 2 }])
})

test('should split 3 items from 2 chunks', async t => {
  const source = toAsyncIterator(['{ "id": 1 }\n{ "i', 'd": 2 }', '\n{"id":3}'])
  const results = []

  for await (const value of ndjson.parse(source)) {
    results.push(value)
  }

  t.deepEqual(results, [{ id: 1 }, { id: 2 }, { id: 3 }])
})

test('should split from Buffers', async t => {
  const source = toAsyncIterator([Buffer.from('{ "id": 1 }\n{ "i'), Buffer.from('d": 2 }'), Buffer.from('\n{"id":3}')])
  const results = []

  for await (const value of ndjson.parse(source)) {
    results.push(value)
  }

  t.deepEqual(results, [{ id: 1 }, { id: 2 }, { id: 3 }])
})

test('should split from Uint8Arrays', async t => {
  const source = toAsyncIterator([toUint8Array('{ "id": 1 }\n{ "i'), toUint8Array('d": 2 }'), toUint8Array('\n{"id":3}')])
  const results = []

  for await (const value of ndjson.parse(source)) {
    results.push(value)
  }

  t.deepEqual(results, [{ id: 1 }, { id: 2 }, { id: 3 }])
})

test('should round trip', async t => {
  const input = '{"id":1}\n{"id":2}\n{"id":3}\n'
  const source = toAsyncIterator([input])
  const results = []

  for await (const value of ndjson.stringify(ndjson.parse(source))) {
    results.push(value)
  }

  t.is(results.join(''), input)
})
