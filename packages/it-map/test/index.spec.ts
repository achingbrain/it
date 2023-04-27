import { expect } from 'aegir/chai'
import all from 'it-all'
import map from '../src/index.js'

async function * asyncGenerator (): AsyncGenerator<number> {
  yield 1
}

function * generator (): Generator<number> {
  yield 1
}

async function * source (): Generator<number> | AsyncGenerator<number> {
  yield 1
}

describe('it-map', () => {
  it('should map an async iterator', async () => {
    const gen = map(asyncGenerator(), (val) => val + 1)
    expect(gen[Symbol.asyncIterator]).to.be.ok()

    const results = await all(gen)
    expect(results).to.have.lengthOf(1)
    expect(results).to.have.nested.property('[0]', 2)
  })

  it('should map an async iterator to a promise', async () => {
    const gen = map(asyncGenerator(), async (val) => val + 1)
    expect(gen[Symbol.asyncIterator]).to.be.ok()

    const results = await all(gen)
    expect(results).to.have.lengthOf(1)
    expect(results).to.have.nested.property('[0]', 2)
  })

  it('should map an iterator', () => {
    const gen = map(generator(), (val) => val + 1)
    expect(gen[Symbol.iterator]).to.be.ok()

    const results = all(gen)
    expect(results).to.have.lengthOf(1)
    expect(results).to.have.nested.property('[0]', 2)
  })

  it('should map an iterator to a promise', async () => {
    const gen = map(generator(), async (val) => val + 1)
    expect(gen[Symbol.asyncIterator]).to.be.ok()

    const results = await all(gen)
    expect(results).to.have.lengthOf(1)
    expect(results).to.have.nested.property('[0]', 2)
  })

  it('should map a source', async () => {
    const gen = map(source(), (val) => val + 1)
    expect(gen[Symbol.asyncIterator]).to.be.ok()

    const results = await all(gen)
    expect(results).to.have.lengthOf(1)
    expect(results).to.have.nested.property('[0]', 2)
  })
})
