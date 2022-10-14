import { expect } from 'aegir/chai'
import all from 'it-all'
import batch from '../src/index.js'

describe('it-batch', () => {
  it('should batch up emitted arrays', async () => {
    const values = [[0, 1, 2], [3], [4]]
    const res = await all(batch(values, 2))

    expect(res).to.deep.equal([[0, 1], [2, 3], [4]])
  })

  it('should batch up emitted arrays in singles', async () => {
    const values = [[0, 1, 2], [3], [4]]
    const res = await all(batch(values, 1))

    expect(res).to.deep.equal([[0], [1], [2], [3], [4]])
  })

  it('should batch up emitted arrays in one array', async () => {
    const values = [[0, 1, 2], [3], [4]]
    const res = await all(batch(values, 100))

    expect(res).to.deep.equal([[0, 1, 2, 3, 4]])
  })

  it('should batch up emitted arrays in small arrays', async () => {
    const values = [[0, 1, 2, 3, 4], [5, 6, 7, 8, 9, 10]]
    const res = await all(batch(values, 1))

    expect(res).to.deep.equal([[0], [1], [2], [3], [4], [5], [6], [7], [8], [9], [10]])
  })

  it('should batch up emitted arrays when no batch size is passed', async () => {
    const values = [[0, 1, 2], [3], [4]]
    const res = await all(batch(values))

    expect(res).to.deep.equal([[0], [1], [2], [3], [4]])
  })

  it('should batch up entries with negative batch size', async () => {
    const values = [[0, 1, 2], [3], [4]]
    const batchSize = -1
    const res = await all(batch(values, batchSize))

    expect(res).to.deep.equal([[0], [1], [2], [3], [4]])
  })

  it('should batch up entries with zero batch size', async () => {
    const values = [[0, 1, 2], [3, 4]]
    const batchSize = 0
    const res = await all(batch(values, batchSize))

    expect(res).to.deep.equal([[0], [1], [2], [3], [4]])
  })

  it('should batch up entries with string batch size', async () => {
    const values = [[0, 1, 2], [3, 4]]
    const batchSize = '2'
    // @ts-expect-error batchSize type is wrong
    const res = await all(batch(values, batchSize))

    expect(res).to.deep.equal([[0, 1], [2, 3], [4]])
  })

  it('should batch up entries with non-integer batch size', async () => {
    const values = [[0, 1, 2], [3, 4]]
    const batchSize = 2.5
    const res = await all(batch(values, batchSize))

    expect(res).to.deep.equal([[0, 1], [2, 3], [4]])
  })
})
