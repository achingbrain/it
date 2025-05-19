import { expect } from 'aegir/chai'
import delay from 'delay'
import all from 'it-all'
import { rpc } from '../src/index.js'
import type { RPC } from '../src/index.js'
import type { AbortOptions } from 'it-pushable'

const target = {
  prop: true,
  async hello (options?: AbortOptions): Promise<boolean> {
    await delay(1_000)
    return true
  },
  inner: {
    async world (options?: AbortOptions): Promise<boolean> {
      await delay(1_000)
      return true
    }
  },
  async supportSimpleArguments (...args: any[]): Promise<any[]> {
    await delay(1_000)
    return args
  },
  generatorContextAccess (options?: AbortOptions): AsyncGenerator<boolean> {
    const generator: AsyncGenerator<boolean> = {
      [Symbol.asyncIterator]: () => {
        return generator
      },
      async next () {
        await delay(1_000)
        return {
          value: true
        }
      },
      async throw () {
        await delay(1_000)
        return {
          done: true,
          value: undefined
        }
      },
      async return () {
        await delay(1_000)
        return {
          done: true,
          value: undefined
        }
      }
    }

    return generator
  }
}

describe('timeouts', () => {
  let serverRPC: RPC
  let clientRPC: RPC
  let senderWithTimeout: typeof target
  let sender: typeof target

  beforeEach(() => {
    // create server and client
    serverRPC = rpc()
    clientRPC = rpc()

    // connect them together
    void serverRPC.sink(clientRPC.source)
    void clientRPC.sink(serverRPC.source)

    // create server side target
    serverRPC.createTarget('target', target)

    // create client side version with default timeout
    senderWithTimeout = clientRPC.createClient<typeof target>('target', {
      timeout: 200
    })

    // create client side version without timeout
    sender = clientRPC.createClient<typeof target>('target')
  })

  afterEach(() => {
    expect(clientRPC).to.have.property('invocations').that.is.empty('client is leaking memory')
  })

  it('should time out when server is slow', async () => {
    // invoke methods on target
    await expect(senderWithTimeout.hello()).to.eventually.be.rejected
      .with.property('name', 'TimeoutError')
  })

  it('should time out via abort signal', async () => {
    // invoke methods on target
    await expect(sender.hello({
      signal: AbortSignal.timeout(10)
    })).to.eventually.be.rejected
      .with.property('name', 'AbortError')
  })

  it('should time out inner invocation when server is slow', async () => {
    // invoke methods on target
    await expect(senderWithTimeout.inner.world()).to.eventually.be.rejected
      .with.property('name', 'TimeoutError')
  })

  it('should time out inner invocation via abort signal', async () => {
    // invoke methods on target
    await expect(sender.inner.world({
      signal: AbortSignal.timeout(10)
    })).to.eventually.be.rejected
      .with.property('name', 'AbortError')
  })

  it('should time out invocation with args[] when server is slow', async () => {
    // invoke methods on target
    await expect(senderWithTimeout.supportSimpleArguments()).to.eventually.be.rejected
      .with.property('name', 'TimeoutError')
  })

  it('should time out invocation with args[] via abort signal', async () => {
    // invoke methods on target
    await expect(sender.supportSimpleArguments({
      signal: AbortSignal.timeout(10)
    })).to.eventually.be.rejected
      .with.property('name', 'AbortError')
  })

  it('should time out generator when server is slow', async () => {
    // invoke methods on target
    await expect(all(senderWithTimeout.generatorContextAccess())).to.eventually.be.rejected
      .with.property('name', 'TimeoutError')
  })

  it('should time out generator via abort signal', async () => {
    // invoke methods on target
    await expect(all(sender.generatorContextAccess({
      signal: AbortSignal.timeout(10)
    }))).to.eventually.be.rejected
      .with.property('name', 'AbortError')
  })

  it('should time out generator throw when server is slow', async () => {
    const gen = senderWithTimeout.generatorContextAccess()

    await expect(gen.throw(new Error('Urk!'))).to.eventually.be.rejected
      .with.property('name', 'TimeoutError')
  })

  it('should time out generator throw via abort signal', async () => {
    const gen = sender.generatorContextAccess({
      signal: AbortSignal.timeout(10)
    })

    // invoke methods on target
    await expect(gen.throw(new Error('Urk!'))).to.eventually.be.rejected
      .with.property('name', 'AbortError')
  })

  it('should time out generator return when server is slow', async () => {
    const gen = senderWithTimeout.generatorContextAccess()

    await expect(gen.return(true)).to.eventually.be.rejected
      .with.property('name', 'TimeoutError')
  })

  it('should time out generator return via abort signal', async () => {
    const gen = sender.generatorContextAccess({
      signal: AbortSignal.timeout(10)
    })

    // invoke methods on target
    await expect(gen.return(true)).to.eventually.be.rejected
      .with.property('name', 'AbortError')
  })
})
