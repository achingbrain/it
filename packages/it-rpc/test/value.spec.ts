import { expect } from 'aegir/chai'
import pDefer from 'p-defer'
import { stubInterface } from 'sinon-ts'
import { ValueType } from '../src/rpc.js'
import { toValue, fromValue } from '../src/value.js'
import type { Invocation } from '../src/types.js'
import type { Pushable } from 'it-pushable'

describe('value', () => {
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
  })

  it('should round trip undefined', () => {
    const value = toValue(undefined)

    expect(value).to.have.property('type', ValueType.undefined)

    expect(fromValue(value, pushable, invocation)).to.equal(undefined)
  })

  it('should round trip null', () => {
    const value = toValue(null)

    expect(value).to.have.property('type', ValueType.null)

    expect(fromValue(value, pushable, invocation)).to.equal(null)
  })

  it('should round trip boolean', () => {
    const value = toValue(true)

    expect(value).to.have.property('type', ValueType.Boolean)

    expect(fromValue(value, pushable, invocation)).to.equal(true)
  })

  it('should round trip number', () => {
    const value = toValue(1)

    expect(value).to.have.property('type', ValueType.Number)

    expect(fromValue(value, pushable, invocation)).to.equal(1)
  })

  it('should round trip string', () => {
    const value = toValue('hello')

    expect(value).to.have.property('type', ValueType.String)

    expect(fromValue(value, pushable, invocation)).to.equal('hello')
  })

  it('should round trip array', () => {
    const value = toValue(['hello'])

    expect(value).to.have.property('type', ValueType.Array)

    expect(fromValue(value, pushable, invocation)).to.deep.equal(['hello'])
  })

  it('should round trip object', () => {
    const value = toValue({ hello: 'world' })

    expect(value).to.have.property('type', ValueType.Object)

    expect(fromValue(value, pushable, invocation)).to.deep.equal({ hello: 'world' })
  })

  it('should round trip class instance', () => {
    class MyClass {
      public val: string = 'hello'

      async bar (): Promise<string> {
        return this.val
      }
    }

    const instance = new MyClass()

    const value = toValue(instance)

    expect(value).to.have.property('type', ValueType.Object)

    const reconstructed = fromValue(value, pushable, invocation)
    expect(reconstructed).to.have.property('val', 'hello')
    expect(reconstructed).to.have.property('bar').that.is.a('function')
  })

  it('should round trip function', () => {
    const value = toValue(() => {}, null, invocation)

    expect(value).to.have.property('type', ValueType.Function)

    expect(invocation.callbacks).to.have.lengthOf(1)
    expect(invocation.callbacks.has(value.value)).to.be.true()

    expect(fromValue(value, pushable, invocation)).to.be.a('function')
  })

  it('should round trip NaN', () => {
    const value = toValue(NaN)

    expect(value).to.have.property('type', ValueType.NaN)
    expect(value).to.have.property('value', '')

    expect(isNaN(fromValue(value, pushable, invocation))).to.be.true()
  })

  it('should round trip Error', () => {
    const value = toValue(new Error('Urk!'))

    expect(value).to.have.property('type', ValueType.Error)

    expect(fromValue(value, pushable, invocation)).to.deep.equal(new Error('Urk!'))
  })

  it.skip('should round trip Promise', () => {

  })

  it('should round trip AsyncGenerator', async () => {
    const generator = (async function * () {
      yield 1
      yield 2
      yield 3
    })()

    const value = toValue(generator)
    expect(value).to.have.property('type', ValueType.AsyncGenerator)

    const reconstructed = fromValue(value, pushable, invocation)
    expect(reconstructed[Symbol.asyncIterator]).to.be.ok()
    expect(reconstructed.next).to.be.a('function')
    expect(reconstructed.return).to.be.a('function')
    expect(reconstructed.throw).to.be.a('function')
  })

  it('should round trip BigInt', () => {
    const value = toValue(1n)

    expect(value).to.have.property('type', ValueType.BigInt)

    expect(fromValue(value, pushable, invocation)).to.equal(1n)
  })

  it('should round trip Map', () => {
    const map = new Map()
    map.set('key', 'value')

    const value = toValue(map)

    expect(value).to.have.property('type', ValueType.Map)

    expect(fromValue(value, pushable, invocation)).to.deep.equal(map)
  })

  it('should round trip Set', () => {
    const set = new Set()
    set.add('value')

    const value = toValue(set)

    expect(value).to.have.property('type', ValueType.Set)

    expect(fromValue(value, pushable, invocation)).to.deep.equal(set)
  })

  it('should round trip Uint8Array', () => {
    const buf = Uint8Array.from([0, 1, 2, 3, 4])
    const value = toValue(buf)

    expect(value).to.have.property('type', ValueType.Uint8Array)

    expect(fromValue(value, pushable, invocation)).to.equalBytes(buf)
  })

  it('should round trip AbortSignal', () => {
    const value = toValue(AbortSignal.timeout(100))
    expect(value).to.have.property('type', ValueType.AbortSignal)

    expect(invocation.abortControllers).to.be.empty()

    const signal = fromValue(value, pushable, invocation)
    expect(signal).to.be.an.instanceOf(AbortSignal)
    expect(signal).to.have.property('aborted', false)

    expect(invocation.abortControllers).to.have.lengthOf(1)
    invocation.abortControllers[0].abort()

    expect(signal).to.have.property('aborted', true)
  })
})
