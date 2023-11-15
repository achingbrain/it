/* eslint-env mocha */
/* eslint-disable max-nested-callbacks */

import { Buffer } from 'buffer'
import { expect } from 'aegir/chai'
import { pair } from 'it-pair'
import { Uint8ArrayList } from 'uint8arraylist'
import { concat as uint8ArrayConcat } from 'uint8arrays/concat'
import { fromString as uint8ArrayFromString } from 'uint8arrays/from-string'
import { byteStream, type ByteStream } from '../src/index.js'

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
    alloc: (length: number, fill = 0) => new Uint8Array(length).fill(fill),
    allocUnsafe: (length: number) => new Uint8Array(length),
    concat: (arrs: Buffer[], length?: number) => uint8ArrayConcat(arrs, length),
    writeInt32BE: (buf: Buffer, value: number, offset: number) => {
      new DataView(buf.buffer, buf.byteOffset, buf.byteLength).setInt32(offset, value, false)
    }
  },
  Uint8ArrayList: {
    from: (str: string) => new Uint8ArrayList(uint8ArrayFromString(str)),
    alloc: (length: number, fill = 0) => new Uint8ArrayList(new Uint8Array(length).fill(fill)),
    allocUnsafe: (length: number) => new Uint8ArrayList(new Uint8Array(length)),
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

  describe(`it-byte-stream ${key}`, () => {
    let b: ByteStream

    beforeEach(() => {
      const duplex = pair<Uint8Array>()
      b = byteStream(duplex)
    })

    it('unwraps underlying stream', () => {
      const stream = pair<Uint8Array>()
      const w = byteStream(stream)

      expect(w.unwrap()).to.equal(stream)
    })

    it('whole', async () => {
      const data = test.from('ww')

      void b.write(data)
      const res = await b.read(2)

      expect(res.subarray()).to.equalBytes(data.subarray())
    })

    it('split', async () => {
      const data = test.from('ww')

      const r = test.from('w')
      void b.write(data)

      const r1 = await b.read(1)
      const r2 = await b.read(1)

      expect(r.subarray()).to.equalBytes(r1.subarray())
      expect(r.subarray()).to.equalBytes(r2.subarray())
    })
  })
})
