import { expect } from 'aegir/chai'
import all from 'it-all'
import filter from '../src/index.js'

describe('it-filter', () => {
  it('should filter all values greater than 2', async () => {
    const values = [0, 1, 2, 3, 4]

    const res = await all(filter(values, val => val > 2))

    expect(res).to.deep.equal([3, 4])
  })

  it('should filter all values greater than 2 with a promise', async () => {
    const values = [0, 1, 2, 3, 4]

    const res = await all(filter(values, async val => val > 2))

    expect(res).to.deep.equal([3, 4])
  })
})
