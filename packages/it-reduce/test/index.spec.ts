import { expect } from 'aegir/chai'
import reduce from '../src/index.js'

function * values (vals: number[] = [0, 1, 2, 3, 4]): Generator<number, void, undefined> {
  yield * vals
}

async function * asyncValues (vals: number[] = [0, 1, 2, 3, 4]): AsyncGenerator<number, void, undefined> {
  yield * values(vals)
}

describe('it-reduce', () => {
  it('should reduce the values yielded from an iterator', () => {
    const result = reduce(values(), (acc, curr) => acc + curr, 0)

    expect(result).to.equal(10)
  })

  it('should reduce the values yielded from an async iterator', async () => {
    const result = reduce(asyncValues(), (acc, curr) => acc + curr, 0)

    expect(result).to.have.property('then').that.is.a('function')
    await expect(result).to.eventually.equal(10)
  })

  it('should reduce the values yielded from an iterator with indexes', async () => {
    const vals = [4, 3, 2, 1, 0]
    const callbackArgs: any[] = []
    const result = reduce(values(vals), (...args: any[]) => {
      callbackArgs.push(args)
      return 0
    }, 0)

    expect(result).to.equal(0)
    expect(callbackArgs).to.have.lengthOf(vals.length)

    vals.forEach((value, index) => {
      expect(callbackArgs).to.have.nested.property(`[${index}][1]`, value)
      expect(callbackArgs).to.have.nested.property(`[${index}][2]`, index)
    })
  })

  it('should reduce the values yielded from an async iterator with indexes', async () => {
    const vals = [4, 3, 2, 1, 0]
    const callbackArgs: any[] = []
    const result = await reduce(asyncValues(vals), (...args: any[]) => {
      callbackArgs.push(args)
      return 0
    }, 0)

    expect(result).to.equal(0)
    expect(callbackArgs).to.have.lengthOf(vals.length)

    vals.forEach((value, index) => {
      expect(callbackArgs).to.have.nested.property(`[${index}][1]`, value)
      expect(callbackArgs).to.have.nested.property(`[${index}][2]`, index)
    })
  })
})
