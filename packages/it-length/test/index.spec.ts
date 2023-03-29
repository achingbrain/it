import { expect } from 'aegir/chai'
import length from '../src/index.js'

describe('it-length', () => {
  it('should count the items in an iterator', () => {
    const values = [0, 1, 2, 3, 4]

    const res = length(values)

    expect(res).to.not.have.property('then')
    expect(res).to.equal(5)
  })

  it('should count the items in an async iterator', async () => {
    const values = (async function * (): AsyncGenerator<number, void, undefined> {
      yield * [0, 1, 2, 3, 4]
    }())

    const res = length(values)

    expect(res).to.have.property('then')
    await expect(res).to.eventually.equal(5)
  })
})
