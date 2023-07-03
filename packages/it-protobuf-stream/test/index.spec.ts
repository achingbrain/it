import { expect } from 'aegir/chai'
import map from 'it-map'
import { pair } from 'it-pair'
import toBuffer from 'it-to-buffer'
import { unsigned } from 'uint8-varint'
import { concat as uint8ArrayConcat } from 'uint8arrays/concat'
import { pbStream } from '../src/index.js'
import { TestMessage } from './fixtures/test-message.js'
import type { ProtobufStream } from '../src/index.js'

/* eslint-env mocha */
/* eslint-disable max-nested-callbacks */

describe('it-protobuf-stream', () => {
  let w: ProtobufStream<any>

  beforeEach(async () => {
    w = pbStream(pair<Uint8Array>())
  })

  it('unwraps underlying stream', () => {
    const stream = pair<Uint8Array>()
    const w = pbStream(stream)

    expect(w.unwrap()).to.equal(stream)
  })

  it('encode/decode', async () => {
    const input = {
      foo: 'bar'
    }

    void w.write(input, TestMessage)

    const output = await w.read(TestMessage)

    expect(output).to.deep.equal(input)
  })

  it('supports pb streams', async () => {
    const input = {
      foo: 'bar'
    }

    const stream = w.pb(TestMessage)

    void stream.write(input)
    const output = await stream.read()

    expect(output).to.deep.equal(input)
  })

  it('supports unwrapping pb streams', async () => {
    const stream = w.pb(TestMessage)

    expect(stream.unwrap()).to.equal(w)
  })

  it('reads remaining data from unwrapped stream in one buffer', async () => {
    const message = {
      foo: 'bar'
    }
    const messageBuf = TestMessage.encode(message)
    const extraData = Uint8Array.from([0, 1, 2, 3, 4, 5])

    const w = pbStream({
      source: (async function * () {
        yield uint8ArrayConcat([
          unsigned.encode(messageBuf.byteLength),
          messageBuf,
          extraData
        ])
      }()),
      sink: async () => {}
    })

    const read = await w.read(TestMessage)
    expect(read).to.deep.equal(message)

    const rest = await toBuffer(map(w.unwrap().source, (buf) => buf.subarray()))
    expect(rest).to.equalBytes(extraData)
  })

  it('reads remaining data from unwrapped stream in multiple buffers', async () => {
    const message = {
      foo: 'bar'
    }
    const messageBuf = TestMessage.encode(message)
    const extraData = Uint8Array.from([0, 1, 2, 3, 4, 5])

    const w = pbStream({
      source: (async function * () {
        yield unsigned.encode(messageBuf.byteLength)
        yield messageBuf
        yield extraData
      }()),
      sink: async () => {}
    })

    const read = await w.read(TestMessage)
    expect(read).to.deep.equal(message)

    const rest = await toBuffer(map(w.unwrap().source, (buf) => buf.subarray()))
    expect(rest).to.equalBytes(extraData)
  })
})
