import { expect } from 'aegir/chai'
import all from 'it-all'
import { toString } from 'uint8arrays/to-string'
import split from '../src/index.js'
import { Buffer } from 'buffer'

describe('it-split', () => {
  it('should split Uint8Arrays by newlines', async () => {
    const encoder = new TextEncoder()
    const values = [
      encoder.encode('hello\nwor'),
      encoder.encode('ld')
    ]

    const res = await all(split(values))

    expect(res.map(buf => toString(buf))).to.deep.equal([
      'hello',
      'world'
    ])
  })

  it('should split Uint8Arrays by arbitrary delimiters', async () => {
    const values = [
      Uint8Array.from([0, 1, 2, 3]),
      Uint8Array.from([0, 1, 2, 3]),
      Uint8Array.from([1, 1, 2])
    ]
    const delimiter = Uint8Array.from([1, 2])

    const res = await all(split(values, {
      delimiter
    }))

    expect(res).to.deep.equal([
      Buffer.from([0]),
      Buffer.from([3, 0]),
      Buffer.from([3, 1])
    ])
  })
})
