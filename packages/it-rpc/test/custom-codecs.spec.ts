import { expect } from 'aegir/chai'
import { encode, decode } from 'cborg'
import { nanoid } from 'nanoid'
import pDefer from 'p-defer'
import { stubInterface } from 'sinon-ts'
import { Values } from '../src/values.js'
import type { Invocation, ValueCodec } from '../src/index.js'
import type { Pushable } from 'it-pushable'

describe('custom values', () => {
  let pushable: Pushable<Uint8Array>
  let invocation: Invocation

  beforeEach(() => {
    pushable = stubInterface()
    invocation = {
      scope: nanoid(),
      parents: [],
      children: new Map(),
      callbacks: new Map(),
      result: pDefer(),
      abortControllers: [],
      abortSignals: []
    }
  })

  it('should support custom values', () => {
    class CustomClass {
      field: string

      constructor (field: string) {
        this.field = field
      }

      getField (): string {
        return this.field
      }
    }

    const customValueCodec: ValueCodec = {
      type: 6000,
      canEncode: (val) => val instanceof CustomClass,
      encode: (val) => encode({
        field: val.getField()
      }),
      decode: (buf) => {
        const vals = decode(buf)

        return new CustomClass(vals.field)
      }
    }

    const codecs = new Values({
      valueCodecs: [
        customValueCodec
      ]
    })

    const value = new CustomClass('hello')
    const encoded = codecs.toValue(value)

    expect(encoded).to.have.property('type', customValueCodec.type)

    const reconstructed = codecs.fromValue(encoded, pushable, invocation)

    expect(reconstructed).to.be.instanceOf(CustomClass)
    expect(reconstructed.getField()).to.equal(value.getField())
  })

  it('should override built-ins', () => {
    // override built-in boolean codec to always return false
    const customValueCodec: ValueCodec = {
      // this number has to be lower than that of the built-in codec we are
      // overriding
      type: 100,
      canEncode: (val) => val === true || val === false,
      decode: () => false
    }

    const codecs = new Values({
      valueCodecs: [
        customValueCodec
      ]
    })

    const encoded = codecs.toValue(true)
    expect(encoded).to.have.property('type', customValueCodec.type)
    expect(codecs.fromValue(encoded, pushable, invocation)).to.be.false()
  })

  it('should require unique type values', () => {
    // override built-in boolean codec to always return false
    const customValueCodec: ValueCodec = {
      // this number has to be lower than that of the built-in codec we are
      // overriding
      type: 100,
      canEncode: (val) => val === true || val === false,
      decode: () => false
    }

    expect(() => {
      return new Values({
        valueCodecs: [
          customValueCodec,
          customValueCodec
        ]
      })
    }).to.throw()
  })
})
