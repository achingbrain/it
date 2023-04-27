/* eslint-env mocha */

import { expect } from 'aegir/chai'
import all from 'it-all'
import batch from '../src/index.js'

describe('it-batched-bytes', () => {
  it('should batch up entries', () => {
    const values = [
      Uint8Array.of(0),
      Uint8Array.of(1),
      Uint8Array.of(2),
      Uint8Array.of(3),
      Uint8Array.of(4)
    ]
    const batchSize = 2
    const gen = batch(values, { size: batchSize })
    expect(gen[Symbol.iterator]).to.be.ok()

    const res = all(gen)
    expect(res).to.deep.equal([Uint8Array.of(0, 1), Uint8Array.of(2, 3), Uint8Array.of(4)])
  })

  it('should batch up an async iterator of entries', async () => {
    const values = async function * (): AsyncGenerator<Uint8Array> {
      yield Uint8Array.of(0)
      yield Uint8Array.of(1)
      yield Uint8Array.of(2)
      yield Uint8Array.of(3)
      yield Uint8Array.of(4)
    }
    const batchSize = 2
    const gen = batch(values(), { size: batchSize })
    expect(gen[Symbol.asyncIterator]).to.be.ok()

    const res = await all(gen)
    expect(res).to.deep.equal([Uint8Array.of(0, 1), Uint8Array.of(2, 3), Uint8Array.of(4)])
  })

  it('should batch up entries without batch size', () => {
    const values = [
      Uint8Array.of(0),
      Uint8Array.of(1),
      Uint8Array.of(2),
      Uint8Array.of(3),
      Uint8Array.of(4)
    ]
    const res = all(batch(values))

    expect(res).to.deep.equal([Uint8Array.of(0, 1, 2, 3, 4)])
  })

  it('should batch up entries with negative batch size', () => {
    const values = [
      Uint8Array.of(0),
      Uint8Array.of(1),
      Uint8Array.of(2),
      Uint8Array.of(3),
      Uint8Array.of(4)
    ]
    const batchSize = -1
    const res = all(batch(values, { size: batchSize }))

    expect(res).to.deep.equal([Uint8Array.of(0, 1, 2, 3, 4)])
  })

  it('should batch up entries with zero batch size', () => {
    const values = [
      Uint8Array.of(0),
      Uint8Array.of(1),
      Uint8Array.of(2),
      Uint8Array.of(3),
      Uint8Array.of(4)
    ]
    const batchSize = 0
    const res = all(batch(values, { size: batchSize }))

    expect(res).to.deep.equal([Uint8Array.of(0, 1, 2, 3, 4)])
  })

  it('should batch up entries with string batch size', () => {
    const values = [
      Uint8Array.of(0),
      Uint8Array.of(1),
      Uint8Array.of(2),
      Uint8Array.of(3),
      Uint8Array.of(4)
    ]
    const batchSize = '2'
    // @ts-expect-error batchSize type is incorrect
    const res = all(batch(values, { size: batchSize }))

    expect(res).to.deep.equal([Uint8Array.of(0, 1), Uint8Array.of(2, 3), Uint8Array.of(4)])
  })

  it('should throw when batching up entries with non-integer batch size', () => {
    const values = [
      Uint8Array.of(0),
      Uint8Array.of(1),
      Uint8Array.of(2),
      Uint8Array.of(3),
      Uint8Array.of(4)
    ]
    const batchSize = 2.5

    expect(() => all(batch(values, { size: batchSize }))).to.throw('Batch size must be an integer')
  })

  it('should accept objects as values and allow serializing them', () => {
    const values = [
      { bytes: Uint8Array.of(0) },
      { bytes: Uint8Array.of(1) },
      { bytes: Uint8Array.of(2) },
      { bytes: Uint8Array.of(3) },
      { bytes: Uint8Array.of(4) }
    ]
    const batchSize = 3
    const res = all(batch(values, {
      size: batchSize,
      serialize: (obj, list) => { list.append(obj.bytes) }
    }))

    expect(res).to.deep.equal([Uint8Array.of(0, 1, 2), Uint8Array.of(3, 4)])
  })
})
