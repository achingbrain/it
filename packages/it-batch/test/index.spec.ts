/* eslint-env mocha */

import batch from '../src/index.js'
import { expect } from 'aegir/chai'
import all from 'it-all'

describe('it-batch', () => {
  it('should batch up entries', async () => {
    const values = [0, 1, 2, 3, 4]
    const batchSize = 2
    const res = await all(batch(values, batchSize))

    expect(res).to.deep.equal([[0, 1], [2, 3], [4]])
  })

  it('should batch up entries without batch size', async () => {
    const values = [0, 1, 2, 3, 4]
    const res = await all(batch(values))

    expect(res).to.deep.equal([[0], [1], [2], [3], [4]])
  })

  it('should batch up entries with negative batch size', async () => {
    const values = [0, 1, 2, 3, 4]
    const batchSize = -1
    const res = await all(batch(values, batchSize))

    expect(res).to.deep.equal([[0], [1], [2], [3], [4]])
  })

  it('should batch up entries with zero batch size', async () => {
    const values = [0, 1, 2, 3, 4]
    const batchSize = 0
    const res = await all(batch(values, batchSize))

    expect(res).to.deep.equal([[0], [1], [2], [3], [4]])
  })

  it('should batch up entries with string batch size', async () => {
    const values = [0, 1, 2, 3, 4]
    const batchSize = '2'
    // @ts-expect-error batchSize type is incorrect
    const res = await all(batch(values, batchSize))

    expect(res).to.deep.equal([[0, 1], [2, 3], [4]])
  })

  it('should batch up entries with non-integer batch size', async () => {
    const values = [0, 1, 2, 3, 4]
    const batchSize = 2.5
    const res = await all(batch(values, batchSize))

    expect(res).to.deep.equal([[0, 1], [2, 3], [4]])
  })
})
