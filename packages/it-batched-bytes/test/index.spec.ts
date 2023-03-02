/* eslint-env mocha */

import batch from '../src/index.js'
import { expect } from 'aegir/chai'
import all from 'it-all'

describe('it-batched-bytes', () => {
  it('should batch up entries', async () => {
    const values = [
      Uint8Array.of(0),
      Uint8Array.of(1),
      Uint8Array.of(2),
      Uint8Array.of(3),
      Uint8Array.of(4)
    ]
    const batchSize = 2
    const res = await all(batch(values, { size: batchSize }))

    expect(res).to.deep.equal([Uint8Array.of(0, 1), Uint8Array.of(2, 3), Uint8Array.of(4)])
  })

  it('should batch up entries without batch size', async () => {
    const values = [
      Uint8Array.of(0),
      Uint8Array.of(1),
      Uint8Array.of(2),
      Uint8Array.of(3),
      Uint8Array.of(4)
    ]
    const res = await all(batch(values))

    expect(res).to.deep.equal([Uint8Array.of(0, 1, 2, 3, 4)])
  })

  it('should batch up entries with negative batch size', async () => {
    const values = [
      Uint8Array.of(0),
      Uint8Array.of(1),
      Uint8Array.of(2),
      Uint8Array.of(3),
      Uint8Array.of(4)
    ]
    const batchSize = -1
    const res = await all(batch(values, { size: batchSize }))

    expect(res).to.deep.equal([Uint8Array.of(0, 1, 2, 3, 4)])
  })

  it('should batch up entries with zero batch size', async () => {
    const values = [
      Uint8Array.of(0),
      Uint8Array.of(1),
      Uint8Array.of(2),
      Uint8Array.of(3),
      Uint8Array.of(4)
    ]
    const batchSize = 0
    const res = await all(batch(values, { size: batchSize }))

    expect(res).to.deep.equal([Uint8Array.of(0, 1, 2, 3, 4)])
  })

  it('should batch up entries with string batch size', async () => {
    const values = [
      Uint8Array.of(0),
      Uint8Array.of(1),
      Uint8Array.of(2),
      Uint8Array.of(3),
      Uint8Array.of(4)
    ]
    const batchSize = '2'
    // @ts-expect-error batchSize type is incorrect
    const res = await all(batch(values, { size: batchSize }))

    expect(res).to.deep.equal([Uint8Array.of(0, 1), Uint8Array.of(2, 3), Uint8Array.of(4)])
  })

  it('should batch up entries with non-integer batch size', async () => {
    const values = [
      Uint8Array.of(0),
      Uint8Array.of(1),
      Uint8Array.of(2),
      Uint8Array.of(3),
      Uint8Array.of(4)
    ]
    const batchSize = 2.5
    const res = await all(batch(values, { size: batchSize }))

    expect(res).to.deep.equal([Uint8Array.of(0, 1, 2), Uint8Array.of(3, 4)])
  })

  it('should batch up values that need serializing', async () => {
    const values = [0, 1, 2, 3, 4]
    const batchSize = 2.5
    const res = await all(batch(values, {
      size: batchSize,
      serialize: (obj, list) => { list.append(Uint8Array.of(obj)) }
    }))

    expect(res).to.deep.equal([Uint8Array.of(0, 1, 2), Uint8Array.of(3, 4)])
  })
})
