/* eslint-env mocha */

import batch from '../src/index.js'
import { expect } from 'aegir/chai'
import all from 'it-all'

describe('it-batch', () => {
  it('should batch up entries', () => {
    const values = [0, 1, 2, 3, 4]
    const batchSize = 2
    const gen = batch(values, batchSize)
    expect(gen[Symbol.iterator]).to.be.ok()

    const res = all(gen)
    expect(res).to.deep.equal([[0, 1], [2, 3], [4]])
  })

  it('should batch up async iterator of entries', async () => {
    const values = async function * (): AsyncGenerator<number, void, undefined> {
      yield * [0, 1, 2, 3, 4]
    }
    const batchSize = 2
    const gen = batch(values(), batchSize)
    expect(gen[Symbol.asyncIterator]).to.be.ok()

    const res = await all(gen)
    expect(res).to.deep.equal([[0, 1], [2, 3], [4]])
  })

  it('should batch up entries without batch size', () => {
    const values = [0, 1, 2, 3, 4]
    const res = all(batch(values))

    expect(res).to.deep.equal([[0], [1], [2], [3], [4]])
  })

  it('should batch up entries with negative batch size', () => {
    const values = [0, 1, 2, 3, 4]
    const batchSize = -1
    const res = all(batch(values, batchSize))

    expect(res).to.deep.equal([[0], [1], [2], [3], [4]])
  })

  it('should batch up entries with zero batch size', () => {
    const values = [0, 1, 2, 3, 4]
    const batchSize = 0
    const res = all(batch(values, batchSize))

    expect(res).to.deep.equal([[0], [1], [2], [3], [4]])
  })

  it('should batch up entries with string batch size', () => {
    const values = [0, 1, 2, 3, 4]
    const batchSize = '2'
    // @ts-expect-error batchSize type is incorrect
    const res = all(batch(values, batchSize))

    expect(res).to.deep.equal([[0, 1], [2, 3], [4]])
  })

  it('should throw when batching up entries with non-integer batch size', () => {
    const values = [0, 1, 2, 3, 4]
    const batchSize = 2.5

    expect(() => all(batch(values, batchSize))).to.throw('Batch size must be an integer')
  })
})
