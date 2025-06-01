import { Buffer } from 'buffer'
import { expect } from 'aegir/chai'
import { byteStream } from 'it-byte-stream'
import { pair } from 'it-pair'
import * as varint from 'uint8-varint'
import { Uint8ArrayList } from 'uint8arraylist'
import { alloc as uint8Alloc, allocUnsafe as uint8AllocUnsafe } from 'uint8arrays/alloc'
import { concat as uint8ArrayConcat } from 'uint8arrays/concat'
import { fromString as uint8ArrayFromString } from 'uint8arrays/from-string'
import { lpStream } from '../src/index.js'
import { int32BEDecode } from './fixtures/int32BE-decode.js'
import { int32BEEncode } from './fixtures/int32BE-encode.js'
import type { LengthPrefixedStream } from '../src/index.js'

/* eslint-env mocha */

interface Test<T> {
  from(str: string): T
  alloc(length: number, fill?: number): T
  allocUnsafe(length: number): T
  concat(arrs: T[], length?: number): T
  writeInt32BE(buf: T, value: number, offset: number): void
}

const tests: Record<string, Test<any>> = {
  Buffer: {
    from: (str: string) => Buffer.from(str),
    alloc: (length: number, fill = 0) => Buffer.alloc(length, fill),
    allocUnsafe: (length: number) => Buffer.allocUnsafe(length),
    concat: (arrs: Buffer[], length?: number) => Buffer.concat(arrs, length),
    writeInt32BE: (buf: Buffer, value: number, offset: number) => buf.writeInt32BE(value, offset)
  },
  Uint8Array: {
    from: (str: string) => uint8ArrayFromString(str),
    alloc: (length: number, fill = 0) => uint8Alloc(length).fill(fill),
    allocUnsafe: (length: number) => uint8AllocUnsafe(length),
    concat: (arrs: Buffer[], length?: number) => uint8ArrayConcat(arrs, length),
    writeInt32BE: (buf: Buffer, value: number, offset: number) => {
      new DataView(buf.buffer, buf.byteOffset, buf.byteLength).setInt32(offset, value, false)
    }
  },
  Uint8ArrayList: {
    from: (str: string) => new Uint8ArrayList(uint8ArrayFromString(str)),
    alloc: (length: number, fill = 0) => new Uint8ArrayList(uint8Alloc(length).fill(fill)),
    allocUnsafe: (length: number) => new Uint8ArrayList(uint8AllocUnsafe(length)),
    concat: (arrs: Uint8ArrayList[], length?: number) => new Uint8ArrayList(...arrs),
    writeInt32BE: (buf: Uint8ArrayList, value: number, offset: number) => {
      const data = new Uint8Array(4)
      new DataView(data.buffer, data.byteOffset, data.byteLength).setInt32(offset, value, false)
      buf.write(data, offset)
    }
  }
}

Object.keys(tests).forEach(key => {
  const test = tests[key]

  describe(`it-length-prefixed-stream ${key}`, () => {
    let lp: LengthPrefixedStream<any>

    beforeEach(async () => {
      lp = lpStream(pair<Uint8Array>())
    })

    it('unwraps underlying stream', () => {
      const stream = pair<Uint8Array>()
      const w = lpStream(stream)

      expect(w.unwrap()).to.equal(stream)
    })

    it('times out when writing', async () => {
      const data = test.from('hellllllllloooo')

      await expect(lp.write(data, {
        signal: AbortSignal.timeout(10)
      })).to.eventually.be.rejected()
        .with.property('code', 'ABORT_ERR')
    })

    it('times out when reading', async () => {
      await expect(lp.read({
        signal: AbortSignal.timeout(10)
      })).to.eventually.be.rejected()
        .with.property('name', 'AbortError')
    })

    it('waits for read when writing', async () => {
      const data = test.from('hellllllllloooo')

      const p = lp.write(data)
      const res = await lp.read()
      expect(res.subarray()).to.equalBytes(data.subarray())

      await expect(p).to.eventually.be.undefined()
    })

    it('lp varint', async () => {
      const data = test.from('hellllllllloooo')

      void lp.write(data)
      const res = await lp.read()
      expect(res.subarray()).to.equalBytes(data.subarray())
    })

    it('lp fixed encode', async () => {
      const duplex = pair<Uint8Array>()
      const lp = lpStream(duplex, { lengthEncoder: int32BEEncode })
      const data = test.from('hellllllllloooo')
      void lp.write(data)

      const bytes = byteStream(lp.unwrap())
      const res = await bytes.read()

      const length = test.allocUnsafe(4)
      test.writeInt32BE(length, data.length, 0)
      const expected = test.concat([length, data])
      expect(res?.subarray()).to.equalBytes(expected.subarray())
    })

    it('lp fixed decode', async () => {
      const duplex = pair<Uint8Array>()

      // write raw lp-prefixed bytes
      const bytes = byteStream(duplex)
      const data = test.from('hellllllllloooo')
      const length = test.allocUnsafe(4)
      test.writeInt32BE(length, data.length, 0)
      const encoded = test.concat([length, data])
      void bytes.write(encoded)

      // read using lp stream and custom decoder
      const wrap = lpStream(bytes.unwrap(), { lengthDecoder: int32BEDecode })
      const res = await wrap.read()
      expect(res.subarray()).to.equalBytes(data.subarray())
    })

    it('lp exceeds max length decode', async () => {
      const duplex = pair<Uint8Array>()

      // write raw lp-prefixed bytes
      const bytes = byteStream(duplex)
      const data = test.alloc(33, 1)
      const encoded = test.concat([
        varint.encode(data.length),
        data
      ])
      void bytes.write(encoded)

      // read using lp stream with data length limit
      const lp = lpStream(bytes.unwrap(), { maxDataLength: 32 })
      await expect(lp.read()).to.eventually.be.rejected
        .with.property('code', 'ERR_MSG_DATA_TOO_LONG')
    })

    it('lp exceeds max length length decode', async () => {
      const duplex = pair<Uint8Array>()

      // write raw lp-prefixed bytes
      const bytes = byteStream(duplex)
      const data = test.alloc(32, 1)

      // more than 128 takes 2 bytes to encode
      const lengthLength = 130

      const encoded = test.concat([
        varint.encode(lengthLength),
        data
      ])
      void bytes.write(encoded)

      // read using lp stream with data length limit
      const lp = lpStream(bytes.unwrap(), { maxDataLength: 32 })
      await expect(lp.read()).to.eventually.be.rejected
        .with.property('code', 'ERR_MSG_LENGTH_TOO_LONG')
    })

    it('lp max length decode', async () => {
      const duplex = pair<Uint8Array>()

      // write raw lp-prefixed bytes
      const bytes = byteStream(duplex)
      const data = test.allocUnsafe(4000)
      const encoded = test.concat([
        varint.encode(data.length),
        data
      ])
      void bytes.write(encoded)

      // read using lp stream and length limit
      const lp = lpStream(bytes.unwrap(), { maxDataLength: 5000 })
      const res = await lp.read()
      expect(res.subarray()).to.equalBytes(data.subarray())
    })

    it('lp writeV', async () => {
      const data = test.from('hellllllllloooo')
      const input = new Uint8ArrayList(data, data, data)

      const p = lp.writeV([data, data, data])
      const res = new Uint8ArrayList(
        await lp.read(),
        await lp.read(),
        await lp.read()
      )
      expect(res.subarray()).to.equalBytes(input.subarray())

      await expect(p).to.eventually.be.undefined()
    })
  })
})
