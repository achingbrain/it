import { expect } from 'aegir/chai'
import { encode } from 'cborg'
import map from 'it-map'
import { pair } from 'it-pair'
import toBuffer from 'it-to-buffer'
import * as varint from 'uint8-varint'
import { concat as uint8ArrayConcat } from 'uint8arrays/concat'
import { cborStream } from '../src/index.js'
import type { CBORStream } from '../src/index.js'

/* eslint-env mocha */

describe('it-cbor-stream', () => {
  let w: CBORStream<any>

  beforeEach(async () => {
    w = cborStream(pair<Uint8Array>())
  })

  it('unwraps underlying stream', () => {
    const stream = pair<Uint8Array>()
    const w = cborStream(stream)

    expect(w.unwrap()).to.equal(stream)
  })

  it('encode/decode', async () => {
    const input = {
      foo: 'bar'
    }

    void w.write(input)

    const output = await w.read()

    expect(output).to.deep.equal(input)
  })

  it('reads remaining data from unwrapped stream in one buffer', async () => {
    const message = {
      foo: 'bar'
    }
    const messageBuf = encode(message)
    const extraData = Uint8Array.from([0, 1, 2, 3, 4, 5])

    const w = cborStream({
      source: (async function * () {
        yield uint8ArrayConcat([
          varint.encode(messageBuf.byteLength),
          messageBuf,
          extraData
        ])
      }()),
      sink: async () => {}
    })

    const read = await w.read()
    expect(read).to.deep.equal(message)

    const rest = await toBuffer(map(w.unwrap().source, (buf) => buf.subarray()))
    expect(rest).to.equalBytes(extraData)
  })

  it('reads remaining data from unwrapped stream in multiple buffers', async () => {
    const message = {
      foo: 'bar'
    }
    const messageBuf = encode(message)
    const extraData = Uint8Array.from([0, 1, 2, 3, 4, 5])

    const w = cborStream({
      source: (async function * () {
        yield varint.encode(messageBuf.byteLength)
        yield messageBuf
        yield extraData
      }()),
      sink: async () => {}
    })

    const read = await w.read()
    expect(read).to.deep.equal(message)

    const rest = await toBuffer(map(w.unwrap().source, (buf) => buf.subarray()))
    expect(rest).to.equalBytes(extraData)
  })
})
