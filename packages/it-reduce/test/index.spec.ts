import { expect } from 'aegir/chai'
import reduce from '../src/index.js'

describe('it-reduce', () => {
  it('should reduce the values yielded from an async iterator', async () => {
    const iter = function * () {
      yield 1
      yield 2
      yield 3
    }

    const result = await reduce(iter(), (acc, curr) => acc + curr, 0)

    expect(result).to.equal(6)
  })
})
