import { expect } from 'aegir/chai'
import { decode } from 'cborg'
import pDefer from 'p-defer'
import { stubInterface } from 'sinon-ts'
import undefinedTransformer from '../src/codecs/1024-undefined.js'
import nullTransformer from '../src/codecs/1025-null.js'
import booleanTransformer from '../src/codecs/1026-boolean.js'
import numberTransformer from '../src/codecs/1027-number.js'
import stringTransformer from '../src/codecs/1028-string.js'
import arrayTransformer from '../src/codecs/1029-array.js'
import functionTransformer from '../src/codecs/1030-function.js'
import nanTransformer from '../src/codecs/1031-nan.js'
import errorTransformer from '../src/codecs/1032-error.js'
import promiseTransformer from '../src/codecs/1033-promise.js'
import asyncGeneratorTransformer from '../src/codecs/1034-async-generator.js'
import bigIntTransformer from '../src/codecs/1035-bigint.js'
import mapTransformer from '../src/codecs/1036-map.js'
import setTransformer from '../src/codecs/1037-set.js'
import uint8ArrayTransformer from '../src/codecs/1038-uint8array.js'
import abortSignalTransformer from '../src/codecs/1039-abort-signal.js'
import dateTransformer from '../src/codecs/1040-date.js'
import regExpTransformer from '../src/codecs/1041-regexp.js'
import objectTransformer from '../src/codecs/2147483647-object.js'
import { Values } from '../src/values.js'
import type { ValueCodecs, Invocation } from '../src/index.js'
import type { Pushable } from 'it-pushable'

describe('values', () => {
  let codec: ValueCodecs
  let pushable: Pushable<Uint8Array>
  let invocation: Invocation

  beforeEach(() => {
    pushable = stubInterface()
    invocation = {
      scope: crypto.randomUUID(),
      parents: [],
      children: new Map(),
      callbacks: new Map(),
      result: pDefer(),
      abortControllers: [],
      abortSignals: []
    }

    codec = new Values()
  })

  it('should round trip undefined', () => {
    const value = codec.toValue(undefined)

    expect(value).to.have.property('type', undefinedTransformer.type)

    expect(codec.fromValue(value, pushable, invocation)).to.equal(undefined)
  })

  it('should round trip null', () => {
    const value = codec.toValue(null)

    expect(value).to.have.property('type', nullTransformer.type)

    expect(codec.fromValue(value, pushable, invocation)).to.equal(null)
  })

  it('should round trip boolean', () => {
    const value = codec.toValue(true)

    expect(value).to.have.property('type', booleanTransformer.type)

    expect(codec.fromValue(value, pushable, invocation)).to.equal(true)
  })

  it('should round trip number', () => {
    const value = codec.toValue(1)

    expect(value).to.have.property('type', numberTransformer.type)

    expect(codec.fromValue(value, pushable, invocation)).to.equal(1)
  })

  it('should round trip string', () => {
    const value = codec.toValue('hello')

    expect(value).to.have.property('type', stringTransformer.type)

    expect(codec.fromValue(value, pushable, invocation)).to.equal('hello')
  })

  it('should round trip array', () => {
    const value = codec.toValue(['hello'])

    expect(value).to.have.property('type', arrayTransformer.type)

    expect(codec.fromValue(value, pushable, invocation)).to.deep.equal(['hello'])
  })

  it('should round trip object', () => {
    const value = codec.toValue({ hello: 'world' })

    expect(value).to.have.property('type', objectTransformer.type)

    expect(codec.fromValue(value, pushable, invocation)).to.deep.equal({ hello: 'world' })
  })

  it('should round trip class instance', () => {
    class MyClass {
      public val: string = 'hello'

      async bar (): Promise<string> {
        return this.val
      }
    }

    const instance = new MyClass()

    const value = codec.toValue(instance)

    expect(value).to.have.property('type', objectTransformer.type)

    const reconstructed = codec.fromValue(value, pushable, invocation)
    expect(reconstructed).to.have.property('val', 'hello')
    expect(reconstructed).to.have.property('bar').that.is.a('function')
  })

  it('should round trip function', () => {
    const value = codec.toValue(() => {}, null, invocation)

    expect(value).to.have.property('type', functionTransformer.type)

    expect(invocation.callbacks).to.have.lengthOf(1)

    if (value.value == null) {
      throw new Error('Callback id was not encoded')
    }

    expect(invocation.callbacks.has(decode(value.value))).to.be.true()

    expect(codec.fromValue(value, pushable, invocation)).to.be.a('function')
  })

  it('should round trip NaN', () => {
    const value = codec.toValue(NaN)

    expect(value).to.have.property('type', nanTransformer.type)
    expect(value).to.have.property('value').that.is.undefined()

    expect(isNaN(codec.fromValue(value, pushable, invocation))).to.be.true()
  })

  it('should round trip Error', () => {
    const value = codec.toValue(new Error('Urk!'))

    expect(value).to.have.property('type', errorTransformer.type)

    expect(codec.fromValue(value, pushable, invocation)).to.deep.equal(new Error('Urk!'))
  })

  it.skip('should round trip Promise', () => {
    const value = codec.toValue(Promise.resolve('hello'))

    expect(value).to.have.property('type', promiseTransformer.type)

    expect(codec.fromValue(value, pushable, invocation)).to.be.an.instanceOf(Promise)
  })

  it('should round trip AsyncGenerator', async () => {
    const generator = (async function * () {
      yield 1
      yield 2
      yield 3
    })()

    const value = codec.toValue(generator)
    expect(value).to.have.property('type', asyncGeneratorTransformer.type)

    const reconstructed = codec.fromValue(value, pushable, invocation)
    expect(reconstructed[Symbol.asyncIterator]).to.be.ok()
    expect(reconstructed.next).to.be.a('function')
    expect(reconstructed.return).to.be.a('function')
    expect(reconstructed.throw).to.be.a('function')
  })

  it('should round trip BigInt', () => {
    const value = codec.toValue(1n)

    expect(value).to.have.property('type', bigIntTransformer.type)

    expect(codec.fromValue(value, pushable, invocation)).to.equal(1n)
  })

  it('should round trip Map', () => {
    const map = new Map()
    map.set('key', 'value')

    const value = codec.toValue(map)

    expect(value).to.have.property('type', mapTransformer.type)

    expect(codec.fromValue(value, pushable, invocation)).to.deep.equal(map)
  })

  it('should round trip Set', () => {
    const set = new Set()
    set.add('value')

    const value = codec.toValue(set)

    expect(value).to.have.property('type', setTransformer.type)

    expect(codec.fromValue(value, pushable, invocation)).to.deep.equal(set)
  })

  it('should round trip Uint8Array', () => {
    const buf = Uint8Array.from([0, 1, 2, 3, 4])
    const value = codec.toValue(buf)

    expect(value).to.have.property('type', uint8ArrayTransformer.type)

    expect(codec.fromValue(value, pushable, invocation)).to.equalBytes(buf)
  })

  it('should round trip AbortSignal', () => {
    const value = codec.toValue(AbortSignal.timeout(100))
    expect(value).to.have.property('type', abortSignalTransformer.type)

    expect(invocation.abortControllers).to.be.empty()

    const signal = codec.fromValue(value, pushable, invocation)
    expect(signal).to.be.an.instanceOf(AbortSignal)
    expect(signal).to.have.property('aborted', false)

    expect(invocation.abortControllers).to.have.lengthOf(1)
    invocation.abortControllers[0].abort()

    expect(signal).to.have.property('aborted', true)
  })

  it('should round trip Date', () => {
    const date = new Date()
    const value = codec.toValue(date)
    expect(value).to.have.property('type', dateTransformer.type)

    const reconstructed = codec.fromValue(value, pushable, invocation)
    expect(reconstructed.toString()).to.equal(date.toString())
  })

  it('should round trip RegExp', () => {
    const regexp = /.*/
    const value = codec.toValue(regexp)
    expect(value).to.have.property('type', regExpTransformer.type)

    const reconstructed = codec.fromValue(value, pushable, invocation)
    expect(reconstructed.toString()).to.equal(regexp.toString())
  })

  it('should round trip RegExp object', () => {
    // eslint-disable-next-line prefer-regex-literals
    const regexp = new RegExp('/.*/', 'g')
    const value = codec.toValue(regexp)
    expect(value).to.have.property('type', regExpTransformer.type)

    const reconstructed = codec.fromValue(value, pushable, invocation)
    expect(reconstructed.toString()).to.equal(regexp.toString())
  })
})
