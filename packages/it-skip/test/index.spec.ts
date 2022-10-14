import { expect } from 'aegir/chai'
import all from 'it-all'
import skip from '../src/index.js'

describe('it-skip', () => {
  it('should skip values from an iterable', async () => {
    const values = [0, 1, 2, 3, 4]

    const res = await all(skip(values, 2))

    expect(res).to.deep.equal([2, 3, 4])
  })
})
