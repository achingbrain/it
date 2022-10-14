/* eslint-env mocha */

import { expect } from 'aegir/chai'
import all from '../src/index.js'

describe('it-all', () => {
  it('Should collect all entries of an async iterator as an array', async () => {
    const values = [0, 1, 2, 3, 4]

    const res = await all(values)

    expect(res).to.deep.equal(values)
  })
})
