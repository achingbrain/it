import { expect } from 'aegir/chai'
import toBuffer from '../src/index.js'

describe('it-to-buffer', () => {
  it('should turn a generator that yields buffers into a buffer', async () => {
    const iter = function * () {
      yield Uint8Array.from([0])
      yield Uint8Array.from([1])
      yield Uint8Array.from([2])
    }

    const result = await toBuffer(iter())

    expect(result).to.equalBytes(Uint8Array.from([0, 1, 2]))
  })

  it('should turn an array buffers into a buffer', async () => {
    const result = await toBuffer([
      Uint8Array.from([0]),
      Uint8Array.from([1]),
      Uint8Array.from([2])
    ])

    expect(result).to.equalBytes(Uint8Array.from([0, 1, 2]))
  })
})
