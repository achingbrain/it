import { expect } from 'aegir/chai'
import last from '../src/index.js'

describe('it-last', () => {
  it('should return only the last result from an async iterator', async () => {
    const values = [0, 1, 2, 3, 4]

    const res = await last(values)

    expect(res).to.equal(4)
  })

  it('should return undefined if the async iterator was empty', async () => {
    const values: any[] = []

    const res = await last(values)

    expect(res).to.be.undefined()
  })
})
