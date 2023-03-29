import { expect } from 'aegir/chai'
import first from '../src/index.js'

describe('it-first', () => {
  it('should return only the first result from an iterator', () => {
    const values = [0, 1, 2, 3, 4]

    const res = first(values)

    expect(res).to.not.have.property('then')
    expect(res).to.equal(0)
  })

  it('should return only the first result from an async iterator', async () => {
    const values = (async function * (): AsyncGenerator<number, void, undefined> {
      yield * [0, 1, 2, 3, 4]
    }())

    const res = first(values)

    expect(res).to.have.property('then')
    await expect(res).to.eventually.equal(0)
  })
})
