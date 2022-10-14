import { expect } from 'aegir/chai'
import all from 'it-all'
import take from '../src/index.js'

describe('it-take', () => {
  it('should limit the number of values returned from an iterable', async () => {
    const values = [0, 1, 2, 3, 4]

    const res = await all(take(values, 2))

    expect(res).to.deep.equal([0, 1])
  })
})
