import { AbortError } from 'abort-error'
import { expect } from 'aegir/chai'
import { rpc } from '../src/index.js'
import type { RPC } from '../src/index.js'

const target = {
  async throwsOnAbort (args: { signal: AbortSignal }) {
    return new Promise((resolve, reject) => {
      args.signal.addEventListener('abort', () => {
        reject(new AbortError())
      })
    })
  },
  async callsCallback (arg: () => Promise<any>) {
    return arg()
  },
  async abortsCallback (arg: (arg: any) => Promise<any>) {
    const signal = AbortSignal.timeout(100)

    await arg({ signal })
  }
}

describe('abort signals', () => {
  let serverRPC: RPC
  let clientRPC: RPC
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

    // create client side version
    sender = clientRPC.createClient<typeof target>('target')
  })

  afterEach(async () => {
    expect(clientRPC).to.have.property('invocations').that.is.empty('client is leaking memory')
    expect(serverRPC).to.have.property('invocations').that.is.empty('server is leaking memory')
  })

  it('should abort a method invocation', async () => {
    const signal = AbortSignal.timeout(100)

    await expect(sender.throwsOnAbort({ signal })).to.eventually.be.rejected
      .with.property('name', 'AbortError')
  })

  it('should allow a callback invocation to abort', async () => {
    const signal = AbortSignal.timeout(100)

    await expect(sender.callsCallback(async () => {
      return new Promise((resolve, reject) => {
        signal.addEventListener('abort', () => {
          reject(new AbortError())
        })
      })
    })).to.eventually.be.rejected
      .with.property('name', 'AbortError')
  })

  it('should abort a callback invocation', async () => {
    await expect(sender.abortsCallback(async (args: { signal: AbortSignal }) => {
      return new Promise((resolve, reject) => {
        args.signal.addEventListener('abort', () => {
          reject(new AbortError())
        })
      })
    })).to.eventually.be.rejected
      .with.property('name', 'AbortError')
  })
})
