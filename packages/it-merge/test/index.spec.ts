import { expect } from 'aegir/chai'
import all from 'it-all'
import merge from '../src/index.js'

describe('it-merge', () => {
  it('should merge multiple arrays', async () => {
    const values1 = [0, 1, 2, 3, 4]
    const values2 = [5, 6, 7, 8, 9]

    const res = await all(merge(values1, values2))

    expect(res.sort((a, b) => {
      if (a < b) {
        return -1
      }

      if (a > b) {
        return 1
      }

      return 0
    })).to.deep.equal([0, 1, 2, 3, 4, 5, 6, 7, 8, 9])
  })
})
