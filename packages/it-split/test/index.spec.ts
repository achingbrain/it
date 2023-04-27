import { Buffer } from 'buffer'
import { expect } from 'aegir/chai'
import all from 'it-all'
import { toString } from 'uint8arrays/to-string'
import split from '../src/index.js'

describe('it-split', () => {
  it('should split Uint8Arrays by newlines', () => {
    const encoder = new TextEncoder()
    const values = [
      encoder.encode('hello\nwor'),
      encoder.encode('ld')
    ]

    const gen = split(values)
    expect(gen[Symbol.iterator]).to.be.ok()

    const res = all(gen)
    expect(res.map(buf => toString(buf))).to.deep.equal([
      'hello',
      'world'
    ])
  })

  it('should split Uint8Arrays by arbitrary delimiters', () => {
    const values = [
      Uint8Array.from([0, 1, 2, 3]),
      Uint8Array.from([0, 1, 2, 3]),
      Uint8Array.from([1, 1, 2])
    ]
    const delimiter = Uint8Array.from([1, 2])

    const gen = split(values, {
      delimiter
    })
    expect(gen[Symbol.iterator]).to.be.ok()

    const res = all(gen)

    expect(res).to.deep.equal([
      Buffer.from([0]),
      Buffer.from([3, 0]),
      Buffer.from([3, 1])
    ])
  })

  it('should split async Uint8Arrays by newlines', async () => {
    const encoder = new TextEncoder()
    const values = async function * (): AsyncGenerator<Uint8Array, void, undefined> {
      yield * [
        encoder.encode('hello\nwor'),
        encoder.encode('ld')
      ]
    }

    const gen = split(values())
    expect(gen[Symbol.asyncIterator]).to.be.ok()

    const res = await all(gen)

    expect(res.map(buf => toString(buf))).to.deep.equal([
      'hello',
      'world'
    ])
  })

  it('should split Uint8Arrays by arbitrary delimiters', async () => {
    const values = async function * (): AsyncGenerator<Uint8Array, void, undefined> {
      yield * [
        Uint8Array.from([0, 1, 2, 3]),
        Uint8Array.from([0, 1, 2, 3]),
        Uint8Array.from([1, 1, 2])
      ]
    }
    const delimiter = Uint8Array.from([1, 2])

    const gen = split(values(), {
      delimiter
    })
    expect(gen[Symbol.asyncIterator]).to.be.ok()

    const res = await all(gen)

    expect(res).to.deep.equal([
      Buffer.from([0]),
      Buffer.from([3, 0]),
      Buffer.from([3, 1])
    ])
  })
})
