import { expect } from 'aegir/chai'
import last from '../src/index.js'

describe('it-last', () => {
  it('should return only the last result from an iterator', async () => {
    const values = [0, 1, 2, 3, 4]

    const res = last(values)

    expect(res).to.not.have.property('then')
    expect(res).to.equal(4)
  })

  it('should return only the last result from an async iterator', async () => {
    const values = (async function * (): AsyncGenerator<number, void, undefined> {
      yield * [0, 1, 2, 3, 4]
    }())

    const res = last(values)

    expect(res).to.have.property('then')
    await expect(res).to.eventually.equal(4)
  })

  it('should return undefined if the async iterator was empty', async () => {
    const values: any[] = []

    const res = await last(values)

    expect(res).to.be.undefined()
  })
})
