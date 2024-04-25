import { expect } from 'aegir/chai'
import toBrowserReadbleStream from '../src/index.js'

async function all <T> (stream: ReadableStream<T>): Promise<T[]> {
  const output: T[] = []

  const reader = stream.getReader()

  try {
    while (true) {
      const { done, value } = await reader.read()

      if (done) {
        return output
      }

      if (value != null) {
        output.push(value)
      }
    }
  } finally {
    reader.releaseLock()
  }
}

function * values <T> (vals: T[]): Generator<T, void, undefined> {
  yield * vals
}

async function * asyncValues <T> (vals: T[]): AsyncIterable<T> {
  yield * values(vals)
}

describe('it-to-browser-readable-stream', () => {
  it('should export something', async () => {
    expect(typeof toBrowserReadbleStream).to.equal('function')
  })

  it('should convert an iterator of bytes', async () => {
    const input = [
      Uint8Array.from([0, 1, 2, 3, 4])
    ]

    const stream = toBrowserReadbleStream(values(input))
    const output = await all(stream)

    expect(output).to.deep.equal(input)
  })

  it('should convert an async iterator of bytes', async () => {
    const input = [
      Uint8Array.from([0, 1, 2, 3, 4])
    ]

    const stream = toBrowserReadbleStream(asyncValues(input))
    const output = await all(stream)

    expect(output).to.deep.equal(input)
  })

  it('should convert an async iterable of bytes', async () => {
    const input = [
      Uint8Array.from([0, 1, 2, 3, 4])
    ]

    // eslint-disable-next-line @typescript-eslint/await-thenable
    const iter = await asyncValues(input)
    const stream = toBrowserReadbleStream(iter)
    const output = await all(stream)

    expect(output).to.deep.equal(input)
  })
})
