import { expect } from 'aegir/chai'
import first from '../src/index.js'

describe('it-first', () => {
  it('should return only the first result from an async iterator', async () => {
    const values = [0, 1, 2, 3, 4]

    const res = await first(values)

    expect(res).to.equal(0)
  })
})
