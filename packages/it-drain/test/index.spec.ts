import { expect } from 'aegir/chai'
import drain from '../src/index.js'

describe('it-drain', () => {
  it('should empty an async iterator', async () => {
    let done = false
    const iter = function * (): Generator<number, void, unknown> {
      yield 1
      yield 2
      yield 3
      done = true
    }

    await drain(iter())

    expect(done).to.be.true()
  })
})
