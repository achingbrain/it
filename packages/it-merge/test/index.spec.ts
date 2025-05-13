import { expect } from 'aegir/chai'
import delay from 'delay'
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

  it('should abort queue push on a short read', async () => {
    let values1Finally = false
    let values2Finally = false
    const yielded: number[] = []
    const received: number[] = []

    const values1 = async function * (): AsyncGenerator<number, void, undefined> {
      try {
        await delay(10)
        yield 0
        yielded.push(0)
        await delay(100)
        yield 2
        yielded.push(2)
      } finally {
        values1Finally = true
      }
    }
    const values2 = async function * (): AsyncGenerator<number, void, undefined> {
      try {
        await delay(10)
        yield 1
        yielded.push(1)
        await delay(100)
        yield 3
        yielded.push(3)
      } finally {
        values2Finally = true
      }
    }

    for await (const val of merge(values1(), values2())) {
      received.push(val)

      if (val === 1) {
        break
      }
    }

    await delay(1000)

    expect(received).to.deep.equal([0, 1])
    expect(yielded).to.deep.equal([0])
    expect(values1Finally).to.be.true()
    expect(values2Finally).to.be.true()
  })
})
