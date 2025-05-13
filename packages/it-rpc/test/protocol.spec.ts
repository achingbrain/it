import { expect } from 'aegir/chai'
import delay from 'delay'
import { encode, decode } from 'it-length-prefixed'
import { pushable } from 'it-pushable'
import { stubInterface } from 'sinon-ts'
import { rpc } from '../src/index.js'
import { InvokeMethodMessage, MessageType, MethodRejectedMessage, MethodResolvedMessage, RPCMessage } from '../src/rpc.js'
import { Values } from '../src/values.js'
import type { Invocation, RPC, ValueCodecs } from '../src/index.js'
import type { Pushable } from 'it-pushable'

const target = {
  prop: true,
  async hello (): Promise<boolean> {
    return true
  },
  async slow (): Promise<boolean> {
    await delay(100)

    return true
  },
  async * slowGenerator (): AsyncGenerator<boolean> {
    await delay(100)
    yield true
    await delay(100)
    yield false
    await delay(100)
    yield true
  }
}

async function readResponse <T> (serverRPC: RPC, type: MessageType, decoder: { decode(buf: Uint8Array): T }): Promise<T> {
  const buf = await decode(serverRPC.source).next()

  if (buf.done === true) {
    throw new Error('No response received')
  }

  const response = RPCMessage.decode(buf.value)
  expect(response.type).to.equal(type)

  return decoder.decode(response.message)
}

describe('protocol', () => {
  let serverRPC: RPC
  let source: Pushable<Uint8Array>
  let codec: ValueCodecs
  let invocation: Invocation

  beforeEach(() => {
    codec = new Values()
    invocation = stubInterface()

    source = pushable()

    // create server
    serverRPC = rpc()

    // create server side target
    serverRPC.createTarget('target', target)

    void serverRPC.sink(encode(source))
  })

  afterEach(() => {
    expect(serverRPC).to.have.property('invocations').that.is.empty('server is leaking memory')
  })

  it('should handle garbage bytes', async () => {
    source.push(Uint8Array.from([239, 123, 32, 98, 42]))
    // no outstanding invocations
  })

  it('should proxy a method invocation', async () => {
    source.push(
      RPCMessage.encode({
        type: MessageType.invokeMethod,
        message: InvokeMethodMessage.encode({
          scope: 'random-id',
          path: 'target.hello'
        })
      })
    )

    const message = await readResponse(serverRPC, MessageType.methodResolved, MethodResolvedMessage)

    if (message.value == null) {
      throw new Error('No value received')
    }

    expect(codec.fromValue(message.value, pushable(), invocation)).to.be.true()
  })

  it('should handle duplicate scope with invoke method messages', async () => {
    source.push(
      RPCMessage.encode({
        type: MessageType.invokeMethod,
        message: InvokeMethodMessage.encode({
          scope: 'not-so-random-id',
          path: 'target.slow'
        })
      })
    )
    source.push(
      RPCMessage.encode({
        type: MessageType.invokeMethod,
        message: InvokeMethodMessage.encode({
          scope: 'not-so-random-id',
          path: 'target.slow'
        })
      })
    )

    const message = await readResponse(serverRPC, MessageType.methodRejected, MethodRejectedMessage)

    if (message.error == null) {
      throw new Error('No error was returned')
    }

    const err = codec.fromValue(message.error, source, invocation)
    expect(err).to.have.property('name', 'DuplicateScopeError')
  })

  it('should handle duplicate scope with invoke generator messages', async () => {
    source.push(
      RPCMessage.encode({
        type: MessageType.invokeGeneratorMethod,
        message: InvokeMethodMessage.encode({
          scope: 'random-id',
          path: 'target.hello'
        })
      })
    )

    const message = await readResponse(serverRPC, MessageType.methodRejected, MethodRejectedMessage)

    if (message.error == null) {
      throw new Error('No error was returned')
    }

    const err = codec.fromValue(message.error, source, invocation)
    expect(err).to.have.property('name', 'InvalidReturnTypeError')
  })

  it('should handle invoking a property', async () => {
    source.push(
      RPCMessage.encode({
        type: MessageType.invokeMethod,
        message: InvokeMethodMessage.encode({
          scope: 'random-id',
          path: 'target.prop'
        })
      })
    )

    const message = await readResponse(serverRPC, MessageType.methodRejected, MethodRejectedMessage)

    if (message.error == null) {
      throw new Error('No error was returned')
    }

    const err = codec.fromValue(message.error, source, invocation)
    expect(err).to.have.property('name', 'InvalidInvocationTypeError')
  })

  it('should handle invoking a function as a generator messages', async () => {
    source.push(
      RPCMessage.encode({
        type: MessageType.invokeGeneratorMethod,
        message: InvokeMethodMessage.encode({
          scope: 'not-so-random-id',
          path: 'target.slowGenerator'
        })
      })
    )
    source.push(
      RPCMessage.encode({
        type: MessageType.invokeGeneratorMethod,
        message: InvokeMethodMessage.encode({
          scope: 'not-so-random-id',
          path: 'target.slowGenerator'
        })
      })
    )

    // first invocation resolves synchronously
    await readResponse(serverRPC, MessageType.methodResolved, MethodResolvedMessage)

    // second invocation errors
    const message = await readResponse(serverRPC, MessageType.methodRejected, MethodRejectedMessage)

    if (message.error == null) {
      throw new Error('No error was returned')
    }

    const err = codec.fromValue(message.error, source, invocation)
    expect(err).to.have.property('name', 'DuplicateScopeError')
  })

  it('should handle method resolved with no invocation', async () => {
    source.push(
      RPCMessage.encode({
        type: MessageType.methodResolved,
        message: MethodResolvedMessage.encode({
          scope: 'random-id',
          value: codec.toValue(true)
        })
      })
    )
    // no outstanding invocations
  })

  it('should handle method rejected with no invocation', async () => {
    source.push(
      RPCMessage.encode({
        type: MessageType.methodRejected,
        message: MethodRejectedMessage.encode({
          scope: 'random-id',
          error: codec.toValue(new Error('Oh noes!'))
        })
      })
    )
    // no outstanding invocations
  })
})
