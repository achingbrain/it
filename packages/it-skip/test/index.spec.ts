import { expect } from 'aegir/chai'
import all from 'it-all'
import skip from '../src/index.js'

describe('it-skip', () => {
  it('should skip values from an iterable', async () => {
    const values = [0, 1, 2, 3, 4]

    const gen = skip(values, 2)
    expect(gen[Symbol.iterator]).to.be.ok()

    const res = all(gen)
    expect(res).to.deep.equal([2, 3, 4])
  })

  it('should skip values from an async iterable', async () => {
    const values = async function * (): AsyncGenerator<number, void, undefined> {
      yield * [0, 1, 2, 3, 4]
    }

    const gen = skip(values(), 2)
    expect(gen[Symbol.asyncIterator]).to.be.ok()

    const res = await all(gen)
    expect(res).to.deep.equal([2, 3, 4])
  })
})
