import { expect } from 'aegir/chai'
import all from 'it-all'
import filter from '../src/index.js'

function * values (): Generator<number, void, undefined> {
  yield * [0, 1, 2, 3, 4]
}

async function * asyncValues (): AsyncGenerator<number, void, undefined> {
  yield * values()
}

describe('it-filter', () => {
  it('should filter all values greater than 2', async () => {
    const res = all(filter(values(), val => val > 2))

    expect(res[Symbol.iterator]).to.be.ok()
    expect(res).to.deep.equal([3, 4])
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
})
