import { expect } from 'aegir/chai'
import { concat as uint8ArrayConcat } from 'uint8arrays/concat'
import bufferStream from '../src/index.js'

describe('it-buffer-stream', () => {
  it('should emit bytes', async () => {
    const expected = 100
    const buffers = []

    for await (const buf of bufferStream(expected)) {
      buffers.push(buf)
    }

    expect(buffers).to.have.lengthOf(1)
    expect(buffers[0]).to.have.lengthOf(expected)
  })

  it('should emit a number of buffers', async () => {
    const expected = 100
    const chunkSize = 10
    const buffers = []

    for await (const buf of bufferStream(expected, {
      chunkSize
    })) {
      buffers.push(buf)
    }

    expect(buffers).to.have.lengthOf(10)
    expect(buffers[0]).to.have.lengthOf(expected / chunkSize)

    const total = buffers.reduce((acc, cur) => acc + cur.length, 0)

    expect(expected).to.equal(total)
  })

  it('should allow collection of buffers', async () => {
    const expected = 100
    let emitted = new Uint8Array(0)
    const buffers = []

    for await (const buf of bufferStream(expected, {
      collector: (buffer) => {
        emitted = uint8ArrayConcat([emitted, buffer])
      }
    })) {
      buffers.push(buf)
    }

    expect(Uint8Array.from(emitted)).to.equalBytes(Uint8Array.from(buffers[0]))
  })

  it('should allow generation of buffers', async () => {
    const expected = 100
    let emitted = new Uint8Array(0)
    const buffers = []

    for await (const buf of bufferStream(expected, {
      generator: (size) => {
        const output = new Uint8Array(size)
        emitted = uint8ArrayConcat([emitted, output])

        return output
      }
    })) {
      buffers.push(buf)
    }

    expect(emitted).to.equalBytes(buffers[0])
  })

  it('should propagate byte generation errors', async () => {
    const generationError = new Error('Urk!')

    try {
      for await (const _ of bufferStream(5, { // eslint-disable-line no-unused-vars
        generator: async () => {
          throw generationError
        }
      })) { // eslint-disable-line no-empty

      }

      throw new Error('No error was thrown')
    } catch (err) {
      expect(err).to.equal(generationError)
    }
  })
})
