import { expect } from 'aegir/chai'
import length from '../src/index.js'

describe('it-length', () => {
  it('should count the items in an async iterator', async () => {
    const values = [0, 1, 2, 3, 4]

    const res = await length(values)

    expect(res).to.equal(5)
  })
})
