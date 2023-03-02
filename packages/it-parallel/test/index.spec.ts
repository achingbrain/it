import { expect } from 'aegir/chai'
import all from 'it-all'
import delay from 'delay'
import parallel from '../src/index.js'

const createFn = (ms: number, result: number) => {
  return async () => {
    await delay(ms)

    return result
  }
}

describe('it-parallel', () => {
  it('should execute and return ordered results', async () => {
    const input = [
      createFn(1000, 1),
      createFn(2000, 2),
      createFn(100, 3),
      createFn(500, 4)
    ]

    const res = await all(parallel(input, {
      concurrency: 3,
      ordered: true
    }))

    expect(res).to.deep.equal([1, 2, 3, 4])
  })

  it('should execute and return unordered results', async () => {
    const input = [
      createFn(1000, 1),
      createFn(2000, 2),
      createFn(100, 3),
      createFn(500, 4)
    ]

    const res = await all(parallel(input, {
      concurrency: 3,
      ordered: false
    }))

    expect(res).to.deep.equal([3, 4, 1, 2])
  })

  it('should not exceed concurrency limit', async () => {
    let running = 0
    let runningMax = 0
    const concurrency = 3

    const createFn = (ms: number, result: number) => {
      return async () => {
        running++

        if (running > runningMax) {
          runningMax = running
        }

        await delay(ms)

        running--

        return result
      }
    }

    const input = [
      createFn(1000, 1),
      createFn(100, 2),
      createFn(100, 3),
      createFn(10, 4),
      createFn(10, 5)
    ]

    const res = await all(parallel(input, { concurrency, ordered: true }))

    expect(res).to.deep.equal([1, 2, 3, 4, 5])

    expect(runningMax).to.equal(concurrency)
  })

  it('should propagate task errors', async () => {
    const error = new Error('wat')

    const input = [
      createFn(100, 1),
      async () => {
        await delay(200)

        throw error
      },
      createFn(50, 3)
    ]

    try {
      await all(parallel(input, { concurrency: 2 }))
    } catch (err) {
      expect(err).to.equal(error)
    }
  })

  it('should propagate source errors', async () => {
    const error = new Error('Urk!')

    async function * source (): AsyncGenerator<() => Promise<string>, void, unknown> {
      yield async () => 'foo'

      throw error
    }

    try {
      await all(parallel(source(), { concurrency: 2 }))
    } catch (err) {
      expect(err).to.equal(error)
    }
  })

  it('should allow source to finish if task errors', async () => {
    let sourceFinished = false
    let index = 0
    const values = [
      async () => {
        await delay(500)
        throw new Error('Urk!')
      },
      async () => {
        await delay(100)
        return 'hello'
      },
      async () => {
        await delay(200)
        return 'hello'
      },
      async () => {
        await delay(300)
        return 'hello'
      },
      async () => {
        await delay(400)
        return 'hello'
      },
      async () => {
        await delay(500)
        return 'world'
      },
      async () => {
        await delay(600)
        return 'world'
      }
    ]

    const source: any = {
      [Symbol.asyncIterator]: () => source,
      async next () {
        const value = values[index]
        index++

        return await Promise.resolve({
          done: index === values.length,
          value
        })
      },
      return () {
        sourceFinished = true
      }
    }

    try {
      await all(parallel(source, { concurrency: 2, ordered: true }))
    } catch {
      expect(sourceFinished).to.be.true()
    }
  })

  it('should work without concurrency parameter', async () => {
    const input = [
      createFn(200, 1),
      createFn(100, 2)
    ]

    const res = await all(parallel(input, { ordered: true }))

    expect(res).to.deep.equal([1, 2])
  })

  it('should batch up entries with negative batch size', async () => {
    const input = [
      createFn(200, 1),
      createFn(100, 2)
    ]
    const concurrency = -1
    const res = await all(parallel(input, { concurrency, ordered: true }))

    expect(res).to.deep.equal([1, 2])
  })

  it('should batch up entries with zero batch size', async () => {
    const input = [
      createFn(200, 1),
      createFn(100, 2)
    ]
    const concurrency = 0
    const res = await all(parallel(input, { concurrency, ordered: true }))

    expect(res).to.deep.equal([1, 2])
  })

  it('should batch up entries with string batch size', async () => {
    const input = [
      createFn(200, 1),
      createFn(100, 2)
    ]
    const concurrency = '2'
    // @ts-expect-error concurrency is wrong type
    const res = await all(parallel(input, { concurrency, ordered: true }))

    expect(res).to.deep.equal([1, 2])
  })

  it('should batch up entries with non-integer batch size', async () => {
    const input = [
      createFn(200, 1),
      createFn(100, 2)
    ]
    const concurrency = 2.5
    const res = await all(parallel(input, { concurrency, ordered: true }))

    expect(res).to.deep.equal([1, 2])
  })

  it('should allow returning errors', async () => {
    const herp = new Error('herp')
    const derp = new Error('derp')

    const input = [
      async () => {
        await delay(200)

        return herp
      },
      async () => {
        await delay(100)

        return derp
      }
    ]
    const concurrency = 2
    const res = await all(parallel(input, { concurrency, ordered: true }))

    expect(res).to.deep.equal([herp, derp])
  })

  it('should work with empty source', async () => {
    const input: any[] = []
    const res = await all(parallel(input))

    expect(res).to.deep.equal([])
  })
})
