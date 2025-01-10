import { Buffer } from 'buffer'
import { expect } from 'aegir/chai'
import all from 'it-all'
import { Uint8ArrayList } from 'uint8arraylist'
import * as ndjson from '../src/index.js'

async function * toAsyncIterator <T> (array: T[]): AsyncIterable<T> {
  for (let i = 0; i < array.length; i++) {
    await new Promise<void>(resolve => setTimeout(() => { resolve() }))
    yield array[i]
  }
}

function toUint8Array (str: string): Uint8Array {
  const arr = new Uint8Array(str.length)
  for (let i = 0; i < str.length; i++) {
    arr[i] = str.charCodeAt(i)
  }
  return arr
}

describe('it-ndjson', () => {
  it('should split 1 item from 1 chunk', async () => {
    const source = toAsyncIterator(['{ "id": 1 }\n'])
    const results = await all(ndjson.parse(source))

    expect(results).to.deep.equal([{ id: 1 }])
  })

  it('should split 1 item from 1 chunk with newline inside', async () => {
    const source = toAsyncIterator([JSON.stringify({ id: 1, bar: 'baz\n' }) + '\n'])
    const results = await all(ndjson.parse(source))

    expect(results).to.deep.equal([{ id: 1, bar: 'baz\n' }])
  })

  it('should split 1 item from 2 chunks', async () => {
    const source = toAsyncIterator(['{ "id', '": 1 }\n'])
    const results = await all(ndjson.parse(source))

    expect(results).to.deep.equal([{ id: 1 }])
  })

  it('should split 2 items from 2 chunks', async () => {
    const source = toAsyncIterator(['{ "id": 1 }\n', '{ "id": 2 }'])
    const results = await all(ndjson.parse(source))

    expect(results).to.deep.equal([{ id: 1 }, { id: 2 }])
  })

  it('should split 2 items from 1 chunk', async () => {
    const source = toAsyncIterator(['{ "id": 1 }\n{ "id": 2 }'])
    const results = await all(ndjson.parse(source))

    expect(results).to.deep.equal([{ id: 1 }, { id: 2 }])
  })

  it('should split 3 items from 2 chunks', async () => {
    const source = toAsyncIterator(['{ "id": 1 }\n{ "i', 'd": 2 }', '\n{"id":3}'])
    const results = await all(ndjson.parse(source))

    expect(results).to.deep.equal([{ id: 1 }, { id: 2 }, { id: 3 }])
  })

  it('should split from Buffers', async () => {
    const source = toAsyncIterator([Buffer.from('{ "id": 1 }\n{ "i'), Buffer.from('d": 2 }'), Buffer.from('\n{"id":3}')])
    const results = await all(ndjson.parse(source))
    expect(results).to.deep.equal([{ id: 1 }, { id: 2 }, { id: 3 }])
  })

  it('should split from Uint8Arrays', async () => {
    const source = toAsyncIterator([toUint8Array('{ "id": 1 }\n{ "i'), toUint8Array('d": 2 }'), toUint8Array('\n{"id":3}')])
    const results = await all(ndjson.parse(source))

    expect(results).to.deep.equal([{ id: 1 }, { id: 2 }, { id: 3 }])
  })

  it('should split from Uint8ArrayLists', async () => {
    const source = toAsyncIterator([new Uint8ArrayList(toUint8Array('{ "id": 1 }\n{ "i')), new Uint8ArrayList(toUint8Array('d": 2 }')), new Uint8ArrayList(toUint8Array('\n{"id":3}'))])
    const results = await all(ndjson.parse(source))

    expect(results).to.deep.equal([{ id: 1 }, { id: 2 }, { id: 3 }])
  })

  it('should split from Uint8ArrayLists with multiple chunks', async () => {
    const source = toAsyncIterator([new Uint8ArrayList(toUint8Array('{ "id": 1 }\n{ "i'), toUint8Array('d": 2 }')), new Uint8ArrayList(toUint8Array('\n{"id":3}'))])
    const results = await all(ndjson.parse(source))

    expect(results).to.deep.equal([{ id: 1 }, { id: 2 }, { id: 3 }])
  })

  it('should round trip', async () => {
    const input = '{"id":1}\n{"id":2}\n{"id":3}\n'
    const source = toAsyncIterator([input])
    const results = await all(ndjson.stringify(ndjson.parse(source)))

    expect(results.join('')).to.equal(input)
  })

  it('should stringify trip', async () => {
    const input = [{ id: 1 }, { id: 2 }, { id: 3 }]
    const source = toAsyncIterator(input)
    const results = await all(ndjson.stringify(source))

    expect(results.join('')).to.equal('{"id":1}\n{"id":2}\n{"id":3}\n')
  })

  it('should limit the incoming message size', async () => {
    const source = toAsyncIterator(['{ "idddddddddddd": 1 }\n'])
    await expect(all(ndjson.parse(source, {
      maxMessageLength: 2
    }))).to.eventually.be.rejected
      .with.property('name', 'InvalidMessageLengthError')
  })
})
