import { expect } from 'aegir/chai'
import toBuffer from '../src/index.js'

describe('it-to-buffer', () => {
  it('should turn a generator that yields buffers into a buffer', () => {
    const iter = function * (): Generator<Uint8Array, void, undefined> {
      yield Uint8Array.from([0])
      yield Uint8Array.from([1])
      yield Uint8Array.from([2])
    }

    const result = toBuffer(iter())

    expect(result).to.not.have.property('then')
    expect(result).to.equalBytes(Uint8Array.from([0, 1, 2]))
  })

  it('should turn an async generator that yields buffers into a buffer', async () => {
    const iter = async function * (): AsyncGenerator<Uint8Array, void, undefined> {
      yield Uint8Array.from([0])
      yield Uint8Array.from([1])
      yield Uint8Array.from([2])
    }

    const result = toBuffer(iter())

    expect(result).to.have.property('then')
    expect(await result).to.equalBytes(Uint8Array.from([0, 1, 2]))
  })

  it('should turn an array buffers into a buffer', () => {
    const result = toBuffer([
      Uint8Array.from([0]),
      Uint8Array.from([1]),
      Uint8Array.from([2])
    ])

    expect(result).to.not.have.property('then')
    expect(result).to.equalBytes(Uint8Array.from([0, 1, 2]))
  })
})
