import { expect } from 'aegir/chai'
import all from 'it-all'
import forEach from '../src/index.js'

describe('it-for-each', () => {
  it('should iterate over every value', () => {
    const values = [0, 1, 2, 3, 4]
    let sum = 0

    const gen = forEach(values, (val) => {
      sum += val
    })

    expect(gen[Symbol.iterator]).to.be.ok()

    const res = all(gen)

    expect(res).to.deep.equal(values)
    expect(10).to.equal(sum)
  })

  it('should iterate over every async value', async () => {
    const values = async function * (): AsyncGenerator<number, void, undefined> {
      yield * [0, 1, 2, 3, 4]
    }
    let sum = 0

    const gen = forEach(values(), (val) => {
      sum += val
    })

    expect(gen[Symbol.asyncIterator]).to.be.ok()

    const res = await all(gen)

    expect(res).to.deep.equal(await all(values()))
    expect(10).to.equal(sum)
  })

  it('should iterate over every value asyncly', async () => {
    const values = [0, 1, 2, 3, 4]
    let sum = 0

    const gen = forEach(values, async (val) => {
      sum += val
    })

    expect(gen[Symbol.asyncIterator]).to.be.ok()

    const res = await all(gen)

    expect(res).to.deep.equal(values)
    expect(10).to.equal(sum)
  })

  it('should iterate over every async value asyncly', async () => {
    const values = async function * (): AsyncGenerator<number, void, undefined> {
      yield * [0, 1, 2, 3, 4]
    }
    let sum = 0

    const gen = forEach(values(), async (val) => {
      sum += val
    })

    expect(gen[Symbol.asyncIterator]).to.be.ok()

    const res = await all(gen)

    expect(res).to.deep.equal(await all(values()))
    expect(10).to.equal(sum)
  })

  it('should abort source', () => {
    const values = [0, 1, 2, 3, 4]
    let sum = 0
    const err = new Error('wat')

    try {
      all(forEach(values, (val) => {
        sum += val

        if (val === 3) {
          throw err
        }
      }))

      throw new Error('Did not abort')
    } catch (e) {
      expect(e).to.equal(err)
      expect(sum).to.equal(6)
    }
  })
})
