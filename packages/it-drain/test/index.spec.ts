import { expect } from 'aegir/chai'
import delay from 'delay'
import drain from '../src/index.js'

describe('it-drain', () => {
  it('should empty an async iterator', async () => {
    let done = false
    const iter = async function * (): AsyncGenerator<number, void, unknown> {
      yield 1
      await delay(1)
      yield 2
      await delay(1)
      yield 3
      done = true
    }

    await drain(iter())

    expect(done).to.be.true()
  })

  it('should empty an iterator', () => {
    let done = false
    const iter = function * (): Generator<number, void, unknown> {
      yield 1
      yield 2
      yield 3
      done = true
    }

    drain(iter())

    expect(done).to.be.true()
  })
})
