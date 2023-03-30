import { expect } from 'aegir/chai'
import reduce from '../src/index.js'

describe('it-reduce', () => {
  it('should reduce the values yielded from an iterator', () => {
    const iter = function * (): Generator<number, void, unknown> {
      yield 1
      yield 2
      yield 3
    }

    const result = reduce(iter(), (acc, curr) => acc + curr, 0)

    expect(result).to.equal(6)
  })

  it('should reduce the values yielded from an async iterator', async () => {
    const iter = async function * (): AsyncGenerator<number, void, unknown> {
      yield 1
      yield 2
      yield 3
    }

    const result = reduce(iter(), (acc, curr) => acc + curr, 0)

    expect(result).to.have.property('then').that.is.a('function')
    await expect(result).to.eventually.equal(6)
  })
})
