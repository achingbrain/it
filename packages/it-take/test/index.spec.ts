import { expect } from 'aegir/chai'
import all from 'it-all'
import take from '../src/index.js'

describe('it-take', () => {
  it('should limit the number of values returned from an iterable', () => {
    const values = [0, 1, 2, 3, 4]

    const gen = take(values, 2)
    expect(gen[Symbol.iterator]).to.be.ok()

    const res = all(gen)
    expect(res).to.deep.equal([0, 1])
  })

  it('should limit the number of values returned from an async iterable', async () => {
    const values = async function * (): AsyncGenerator<number, void, undefined> {
      yield * [0, 1, 2, 3, 4]
    }

    const gen = take(values(), 2)
    expect(gen[Symbol.asyncIterator]).to.be.ok()

    const res = await all(gen)
    expect(res).to.deep.equal([0, 1])
  })
})
