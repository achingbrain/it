/* eslint-env mocha, browser */

import { expect } from 'aegir/chai'
import all from 'it-all'
import toIt from '../src/index.js'

describe('blob-to-it', () => {
  it('should convert a blob to an async iterator', async () => {
    const content = [Uint8Array.from([0, 1, 2, 3, 4])]
    const blob = new Blob(content)
    const result = await all(toIt(blob))

    expect(content).to.deep.equal(result)
  })
})
