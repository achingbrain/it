import { expect } from 'aegir/chai'
import all from 'it-all'
import delay from 'delay'
import parallelBatch from '../src/index.js'

describe('it-parallel-batch', () => {
  it('should batch up emitted arrays', async () => {
    const input = [
      async () => {
        await delay(200)

        return 1
      },
      async () => {
        await delay(100)

        return 2
      }
    ]

    const res = await all(parallelBatch(input, 2))

    expect(res).to.deep.equal([1, 2])
  })

  it('should batch up emitted arrays in the right order', async () => {
    const input = [
      async () => {
        await delay(100)

        return 1
      },
      async () => {
        await delay(200)

        return 2
      },
      async () => {
        await delay(50)

        return 3
      }
    ]

    const res = await all(parallelBatch(input, 2))

    expect(res).to.deep.equal([1, 2, 3])
  })

  it('should propagate errors', async () => {
    const error = new Error('wat')

    const input = [
      async () => {
        await delay(100)

        return 1
      },
      async () => {
        await delay(200)

        throw error
      },
      async () => {
        await delay(50)

        return 3
      }
    ]

    try {
      await all(parallelBatch(input, 2))
    } catch (err) {
      expect(err).to.equal(error)
    }
  })

  it('should execute batch in parallel', async () => {
    const error = new Error('wat')
    const started = [false, false, false]

    const input = [
      async () => {
        started[0] = true

        await delay(200)

        return 1
      },
      async () => {
        started[1] = true

        await delay(100)

        throw error
      },
      async () => {
        // in second batch, should not execute
        started[2] = true

        await delay(100)

        return 3
      }
    ]

    try {
      await all(parallelBatch(input, 2))
    } catch (err) {
      expect(err).to.equal(error)
    }

    expect(started).to.deep.equal([true, true, false])
  })

  it('should work without size parameter', async () => {
    const input = [
      async () => {
        await delay(200)

        return 1
      },
      async () => {
        await delay(100)

        return 2
      }
    ]

    const res = await all(parallelBatch(input))

    expect(res).to.deep.equal([1, 2])
  })

  it('should batch up entries with negative batch size', async () => {
    const input = [
      async () => {
        await delay(200)

        return 1
      },
      async () => {
        await delay(100)

        return 2
      }
    ]
    const batchSize = -1
    const res = await all(parallelBatch(input, batchSize))

    expect(res).to.deep.equal([1, 2])
  })

  it('should batch up entries with zero batch size', async () => {
    const input = [
      async () => {
        await delay(200)

        return 1
      },
      async () => {
        await delay(100)

        return 2
      }
    ]
    const batchSize = 0
    const res = await all(parallelBatch(input, batchSize))

    expect(res).to.deep.equal([1, 2])
  })

  it('should batch up entries with string batch size', async () => {
    const input = [
      async () => {
        await delay(200)

        return 1
      },
      async () => {
        await delay(100)

        return 2
      }
    ]
    const batchSize = '2'
    // @ts-expect-error batchSize type is wrong
    const res = await all(parallelBatch(input, batchSize))

    expect(res).to.deep.equal([1, 2])
  })

  it('should throw when batching up entries with non-integer batch size', async () => {
    const input = async function * (): AsyncGenerator<() => Promise<number>, void, undefined> {
      yield async () => {
        await delay(200)

        return 1
      }
      yield async () => {
        await delay(100)

        return 2
      }
    }
    const batchSize = 2.5

    await expect(all(parallelBatch(input(), batchSize))).to.eventually.be.rejectedWith('Batch size must be an integer')
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
    const batchSize = 2
    const res = await all(parallelBatch(input, batchSize))

    expect(res).to.deep.equal([herp, derp])
  })
})
