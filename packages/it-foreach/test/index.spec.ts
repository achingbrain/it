import { expect } from 'aegir/chai'
import all from 'it-all'
import forEach from '../src/index.js'

function * values (vals: number[] = [0, 1, 2, 3, 4]): Generator<number, void, undefined> {
  yield * vals
}

async function * asyncValues (vals: number[] = [0, 1, 2, 3, 4]): AsyncGenerator<number, void, undefined> {
  yield * values(vals)
}

describe('it-for-each', () => {
  it('should iterate over every value', () => {
    const vals = [0, 1, 2, 3, 4]
    let sum = 0

    const gen = forEach(values(vals), (val) => {
      sum += val
    })

    expect(gen[Symbol.iterator]).to.be.ok()

    const res = all(gen)

    expect(res).to.deep.equal(vals)
    expect(10).to.equal(sum)
  })

  it('should iterate over every async value', async () => {
    const vals = [0, 1, 2, 3, 4]
    let sum = 0

    const gen = forEach(asyncValues(vals), (val) => {
      sum += val
    })

    expect(gen[Symbol.asyncIterator]).to.be.ok()

    const res = await all(gen)

    expect(res).to.deep.equal(vals)
    expect(10).to.equal(sum)
  })

  it('should iterate over every value asyncly', async () => {
    const vals = [0, 1, 2, 3, 4]
    let sum = 0

    const gen = forEach(values(), async (val) => {
      sum += val
    })

    expect(gen[Symbol.asyncIterator]).to.be.ok()

    const res = await all(gen)

    expect(res).to.deep.equal(vals)
    expect(10).to.equal(sum)
  })

  it('should iterate over every async value asyncly', async () => {
    const vals = [0, 1, 2, 3, 4]
    let sum = 0

    const gen = forEach(asyncValues(), async (val) => {
      sum += val
    })

    expect(gen[Symbol.asyncIterator]).to.be.ok()

    const res = await all(gen)

    expect(res).to.deep.equal(vals)
    expect(10).to.equal(sum)
  })

  it('should abort source', () => {
    let sum = 0
    const err = new Error('wat')

    try {
      all(forEach(values(), (val) => {
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

  it('should iterate over values with indexes', async () => {
    const vals = [4, 3, 2, 1, 0]
    const callbackArgs: any[] = []
    const gen = forEach(values(vals), (...args: [number]) => {
      callbackArgs.push(args)
    })
    expect(gen[Symbol.iterator]).to.be.ok()

    const results = all(gen)
    expect(results).to.have.lengthOf(vals.length)
    expect(callbackArgs).to.have.lengthOf(vals.length)

    vals.forEach((value, index) => {
      expect(callbackArgs).to.have.nested.property(`[${index}][0]`, value)
      expect(callbackArgs).to.have.nested.property(`[${index}][1]`, index)
    })
  })

  it('should iterate over async values with indexes', async () => {
    const vals = [4, 3, 2, 1, 0]
    const callbackArgs: any[] = []
    const gen = forEach(asyncValues(vals), (...args: any[]) => {
      callbackArgs.push(args)
    })
    expect(gen[Symbol.asyncIterator]).to.be.ok()

    const results = await all(gen)
    expect(results).to.have.lengthOf(vals.length)
    expect(callbackArgs).to.have.lengthOf(vals.length)

    vals.forEach((value, index) => {
      expect(callbackArgs).to.have.nested.property(`[${index}][0]`, value)
      expect(callbackArgs).to.have.nested.property(`[${index}][1]`, index)
    })
  })

  it('should iterate over async values with indexes asyncly', async () => {
    const vals = [4, 3, 2, 1, 0]
    const callbackArgs: any[] = []
    const gen = forEach(asyncValues(vals), async (...args: any[]) => {
      callbackArgs.push(args)
    })
    expect(gen[Symbol.asyncIterator]).to.be.ok()

    const results = await all(gen)
    expect(results).to.have.lengthOf(vals.length)
    expect(callbackArgs).to.have.lengthOf(vals.length)

    vals.forEach((value, index) => {
      expect(callbackArgs).to.have.nested.property(`[${index}][0]`, value)
      expect(callbackArgs).to.have.nested.property(`[${index}][1]`, index)
    })
  })
})
