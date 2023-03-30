import { expect } from 'aegir/chai'
import map from '../src/index.js'

describe('it-map', () => {
  it('should map an async iterator', async () => {
    const iter = async function * (): AsyncGenerator<number> {
      yield 1
    }

    const gen = map(iter(), (val) => val + 1)
    expect(gen[Symbol.asyncIterator]).to.be.ok()

    for await (const result of gen) {
      expect(result).to.equal(2)
    }
  })

  it('should map an async iterator to a promise', async () => {
    const iter = async function * (): AsyncGenerator<number, void, unknown> {
      yield 1
    }

    const gen = map(iter(), async (val) => val + 1)
    expect(gen[Symbol.asyncIterator]).to.be.ok()

    for await (const result of gen) {
      expect(result).to.equal(2)
    }
  })

  it('should map an iterator', () => {
    const iter = function * (): Generator<number> {
      yield 1
    }

    const gen = map(iter(), (val) => val + 1)
    expect(gen[Symbol.iterator]).to.be.ok()

    for (const result of gen) {
      expect(result).to.equal(2)
    }
  })

  it('should map an iterator to a promise', async () => {
    const iter = function * (): Generator<number> {
      yield 1
    }

    const gen = map(iter(), async (val) => val + 1)
    expect(gen[Symbol.asyncIterator]).to.be.ok()

    for await (const result of gen) {
      expect(result).to.equal(2)
    }
  })
})
