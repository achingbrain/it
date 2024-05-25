import { expect } from 'aegir/chai'
import { rpc } from '../src/index.js'
import type { RPC } from '../src/index.js'

const target = {
  async callsCallback (arg: () => Promise<any>) {
    return arg()
  },
  async callsVoidCallback (arg: () => void) {
    arg()
  },
  async callsVoidCallbackWithArg (arg: (a: boolean) => void) {
    arg(true)
  },
  async callsCallbackWithHello (arg: (arg: any) => Promise<any>) {
    return arg('hello')
  },
  async callsNestedCallbackWithHello (arg: { foo: { bar(arg: any): Promise<any> } }) {
    return arg.foo.bar('hello')
  },
  async callsNestedCallback (arg: { foo: { bar(): Promise<any> } }) {
    return arg.foo.bar()
  }
}

describe('callbacks', () => {
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

  afterEach(() => {
    expect(clientRPC).to.have.property('invocations').that.is.empty('client is leaking memory')
    expect(serverRPC).to.have.property('invocations').that.is.empty('server is leaking memory')
  })

  it('should call a callback argument', async () => {
    await expect(sender.callsCallbackWithHello(async (arg) => arg)).to.eventually.equal('hello')
  })

  it('should call a void callback argument', async () => {
    let called = false
    const cb = (): void => {
      called = true
    }

    await sender.callsVoidCallback(cb)
    expect(called).to.be.true()
  })

  it('should call a void callback argument with value', async () => {
    let called
    const cb = (c: boolean): void => {
      called = c
    }

    await sender.callsVoidCallbackWithArg(cb)
    expect(called).to.be.true()
  })

  it('should call a nested callback argument', async () => {
    await expect(sender.callsNestedCallbackWithHello({ foo: { bar: async (arg) => arg } })).to.eventually.equal('hello')
  })

  it('should call a callback argument and retain scope', async () => {
    class MyClass {
      public val: string = 'hello'

      async bar (): Promise<string> {
        return this.val
      }
    }

    await expect(sender.callsNestedCallback({ foo: new MyClass() })).to.eventually.equal('hello')
  })
})
