import { expect } from 'aegir/chai'
import all from 'it-all'
import map from '../src/index.js'

async function * asyncGenerator (vals: number[] = [1]): AsyncGenerator<number, void, undefined> {
  yield * vals
}

function * generator (vals: number[] = [1]): Generator<number, void, undefined> {
  yield * vals
}

async function * source (vals: number[] = [1]): Generator<number, void, undefined> | AsyncGenerator<number, void, undefined> {
  yield * vals
}

describe('it-map', () => {
  it('should map an async generator', async () => {
    const gen = map(asyncGenerator(), (val) => val + 1)
    expect(gen[Symbol.asyncIterator]).to.be.ok()

    const results = await all(gen)
    expect(results).to.have.lengthOf(1)
    expect(results).to.have.nested.property('[0]', 2)
  })

  it('should map an async generator with indexes', async () => {
    const vals = [4, 3, 2, 1, 0]
    const gen = map(asyncGenerator(vals), (...args: any[]) => args)
    expect(gen[Symbol.asyncIterator]).to.be.ok()

    const results = await all(gen)
    expect(results).to.have.lengthOf(vals.length)

    vals.forEach((value, index) => {
      expect(results).to.have.nested.property(`[${index}][0]`, value)
      expect(results).to.have.nested.property(`[${index}][1]`, index)
    })
  })

  it('should map an async generator to a promise', async () => {
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

  it('should map an iterator with indexes', async () => {
    const vals = [4, 3, 2, 1, 0]
    const gen = map(generator(vals), (...args: any[]) => args)
    expect(gen[Symbol.iterator]).to.be.ok()

    const results = all(gen)
    expect(results).to.have.lengthOf(vals.length)

    vals.forEach((value, index) => {
      expect(results).to.have.nested.property(`[${index}][0]`, value)
      expect(results).to.have.nested.property(`[${index}][1]`, index)
    })
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

  it('should map a source with indexes', async () => {
    const vals = [4, 3, 2, 1, 0]
    const gen = map(source(vals), (...args: any[]) => args)
    expect(gen[Symbol.asyncIterator]).to.be.ok()

    const results = await all(gen)
    expect(results).to.have.lengthOf(vals.length)

    vals.forEach((value, index) => {
      expect(results).to.have.nested.property(`[${index}][0]`, value)
      expect(results).to.have.nested.property(`[${index}][1]`, index)
    })
  })
})
