/* eslint-env mocha */

import { expect } from 'aegir/chai'
import all from '../src/index.js'

describe('it-all', () => {
  it('should collect all entries of an iterator as an array', () => {
    const values = [0, 1, 2, 3, 4]

    const res = all(values)

    expect(res).to.not.have.property('then')
    expect(res).to.deep.equal(values)
  })

  it('should collect all entries of an async iterator as an array', async () => {
    const values = [0, 1, 2, 3, 4]

    const generator = (async function * (): AsyncGenerator<number, void, undefined> {
      yield * [0, 1, 2, 3, 4]
    })()

    const p = all(generator)
    expect(p).to.have.property('then').that.is.a('function')

    const res = await p
    expect(res).to.deep.equal(values)
  })
})
