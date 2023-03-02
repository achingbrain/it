import { expect } from 'aegir/chai'
import map from '../src/index.js'

describe('it-map', () => {
  it('should map an async iterator', async () => {
    const iter = function * (): Generator<number, void, unknown> {
      yield 1
    }

    for await (const result of map(iter(), (val) => val + 1)) {
      expect(result).to.equal(2)
    }
  })

  it('should map an async iterator to a promise', async () => {
    const iter = function * (): Generator<number, void, unknown> {
      yield 1
    }

    for await (const result of map(iter(), async (val) => val + 1)) {
      expect(result).to.equal(2)
    }
  })
})
