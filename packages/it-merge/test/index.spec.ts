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

  it('should support backpressure', async () => {
    let values1Yielded = 0
    let values2Yielded = 0

    const values1 = async function * (): AsyncGenerator<number, void, undefined> {
      values1Yielded++
      yield 0
      values1Yielded++
      yield 1
      values1Yielded++
      yield 2
      values1Yielded++
      yield 3
    }
    const values2 = async function * (): AsyncGenerator<number, void, undefined> {
      values2Yielded++
      yield 4
      values2Yielded++
      yield 5
      values2Yielded++
      yield 6
      values2Yielded++
      yield 7
    }

    const gen = merge(values1(), values2())

    const res1 = await gen.next()
    expect(res1).to.have.property('done', false)
    expect(res1).to.have.property('value', 0)
    expect(values1Yielded).to.equal(1, 'first generator continued yielding without a consumer')
    expect(values2Yielded).to.equal(1, 'second generator continued yielding without a consumer')

    const res2 = await gen.next()
    expect(res2).to.have.property('done', false)
    expect(res2).to.have.property('value', 4)
    expect(values1Yielded).to.equal(1, 'first generator continued yielding without a consumer')
    expect(values2Yielded).to.equal(1, 'second generator continued yielding without a consumer')

    const res3 = await gen.next()
    expect(res3).to.have.property('done', false)
    expect(res3).to.have.property('value', 1)
    expect(values1Yielded).to.equal(2, 'first generator continued yielding without a consumer')
    expect(values2Yielded).to.equal(2, 'second generator continued yielding without a consumer')

    const res4 = await gen.next()
    expect(res4).to.have.property('done', false)
    expect(res4).to.have.property('value', 5)
    expect(values1Yielded).to.equal(2, 'first generator continued yielding without a consumer')
    expect(values2Yielded).to.equal(2, 'second generator continued yielding without a consumer')
  })
})
