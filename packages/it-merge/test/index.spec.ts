import { expect } from 'aegir/chai'
import all from 'it-all'
import merge from '../src/index.js'

describe('it-merge', () => {
  it('should merge multiple arrays', async () => {
    const values1 = [0, 1, 2, 3, 4]
    const values2 = [5, 6, 7, 8, 9]

    const gen = merge(values1, values2)
    expect(gen[Symbol.iterator]).to.be.ok()

    const res = all(gen)

    expect(res.sort((a, b) => {
      if (a < b) {
        return -1
      }

      if (a > b) {
        return 1
      }

      return 0
    })).to.deep.equal([0, 1, 2, 3, 4, 5, 6, 7, 8, 9])
  })

  it('should merge multiple async iterators', async () => {
    const values1 = async function * (): AsyncGenerator<number, void, undefined> {
      yield * [0, 1, 2, 3, 4]
    }
    const values2 = async function * (): AsyncGenerator<number, void, undefined> {
      yield * [5, 6, 7, 8, 9]
    }

    const gen = merge(values1(), values2())
    expect(gen[Symbol.asyncIterator]).to.be.ok()

    const res = await all(gen)

    expect(res.sort((a, b) => {
      if (a < b) {
        return -1
      }

      if (a > b) {
        return 1
      }

      return 0
    })).to.deep.equal([0, 1, 2, 3, 4, 5, 6, 7, 8, 9])
  })
})
