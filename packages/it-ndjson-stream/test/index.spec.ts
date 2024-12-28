import { expect } from 'aegir/chai'
import { pair } from 'it-pair'
import { ndjsonStream } from '../src/index.js'
import type { NDJSONStream } from '../src/index.js'

const obj = { foo: 'bar' }

describe('it-ndjson-stream', () => {
  let messages: NDJSONStream<{ foo: string }>

  beforeEach(async () => {
    messages = ndjsonStream(pair<Uint8Array>())
  })

  it('unwraps underlying stream', () => {
    const stream = pair<Uint8Array>()
    const w = ndjsonStream(stream)

    expect(w.unwrap()).to.equal(stream)
  })

  it('times out when writing', async () => {
    await expect(messages.write(obj, {
      signal: AbortSignal.timeout(10)
    })).to.eventually.be.rejected()
      .with.property('name', 'AbortError')
  })

  it('times out when reading', async () => {
    await expect(messages.read({
      signal: AbortSignal.timeout(10)
    })).to.eventually.be.rejected()
      .with.property('name', 'AbortError')
  })

  it('waits for read when writing', async () => {
    const p = messages.write(obj)
    const res = await messages.read()
    expect(res).to.deep.equal(obj)

    await expect(p).to.eventually.be.undefined()
  })

  it('reads', async () => {
    void messages.write(obj)
    const res = await messages.read()
    expect(res).to.deep.equal(obj)
  })

  it('max message length decode', async () => {
    messages = ndjsonStream({
      source: ['{"foo":"bar"}'],
      sink: async () => {}
    }, {
      maxMessageLength: 2
    })

    // read using stream with message length limit
    await expect(messages.read()).to.eventually.be.rejected
      .with.property('name', 'InvalidMessageLengthError')
  })
})
