import { expect } from 'aegir/chai'
import all from 'it-all'
import filter from '../src/index.js'

function * values (vals: number[] = [0, 1, 2, 3, 4]): Generator<number, void, undefined> {
  yield * vals
}

async function * asyncValues (vals: number[] = [0, 1, 2, 3, 4]): AsyncGenerator<number, void, undefined> {
  yield * values(vals)
}

describe('it-filter', () => {
  it('should filter all values greater than 2', async () => {
    const res = all(filter(values(), val => val > 2))

    expect(res[Symbol.iterator]).to.be.ok()
    expect(res).to.deep.equal([3, 4])
  })

  it('should filter all values less than 2', async () => {
    const res = all(filter(values(), val => val < 2))

    expect(res[Symbol.iterator]).to.be.ok()
    expect(res).to.deep.equal([0, 1])
  })

  it('should filter all values greater than 2 with a promise', () => {
    const res = all(filter(values(), val => val > 2))

    expect(res[Symbol.iterator]).to.be.ok()
    expect(res).to.deep.equal([3, 4])
  })

  it('should filter all values greater than 2 with a promise', async () => {
    const res = filter(values(), async val => val > 2)

    expect(res[Symbol.asyncIterator]).to.be.ok()
    await expect(all(res)).to.eventually.deep.equal([3, 4])
  })

  it('should filter all async values greater than 2', async () => {
    const res = filter(asyncValues(), val => val > 2)

    expect(res[Symbol.asyncIterator]).to.be.ok()
    await expect(all(res)).to.eventually.deep.equal([3, 4])
  })

  it('should filter all async values greater than 2 with a promise', async () => {
    const res = filter(asyncValues(), async val => val > 2)

    expect(res[Symbol.asyncIterator]).to.be.ok()
    await expect(all(res)).to.eventually.deep.equal([3, 4])
  })

  it('should filter values with indexes', async () => {
    const vals = [4, 3, 2, 1, 0]
    const callbackArgs: any[] = []
    const gen = filter(values(vals), (...args: any[]) => {
      callbackArgs.push(args)
      return true
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

  it('should filter async values with indexes', async () => {
    const vals = [4, 3, 2, 1, 0]
    const callbackArgs: any[] = []
    const gen = filter(asyncValues(vals), (...args: any[]) => {
      callbackArgs.push(args)
      return true
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
