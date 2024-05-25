import { expect } from 'aegir/chai'
import { rpc } from '../src/index.js'
import type { RPC } from '../src/index.js'

const target = {
  prop: true,
  async hello (): Promise<boolean> {
    return true
  },
  inner: {
    async world (): Promise<boolean> {
      return true
    }
  },
  async supportSimpleArguments (...args: any[]): Promise<any[]> {
    return args
  }
}

describe('basics', () => {
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

  it('should proxy a method invocation', async () => {
    // invoke methods on target
    await expect(sender.inner.world()).to.eventually.be.true()
    await expect(sender.hello()).to.eventually.be.true()
  })

  it('should fail to call a method that does not exist', async () => {
    // @ts-expect-error method does not exist
    await expect(sender.outer.world()).to.eventually.be.rejected
      .with.property('name', 'MethodNotFoundError')
  })

  it('should fail to access a property', async () => {
    await expect(sender.prop).to.eventually.be.rejected
      .with.property('name', 'InvalidMethodError')
  })

  it('should support primitive values as arguments', async () => {
    const input = [undefined, null, true, 1, 'hello', NaN, 1n]

    await expect(sender.supportSimpleArguments(...input)).to.eventually.deep.equal(input)
  })

  it('should support object values as arguments', async () => {
    const input = [Uint8Array.from([0, 1, 2, 3, 4]), { hello: 'world' }, new Map([['key', 'value']]), new Set(['value']), new Error('Urk!')]

    await expect(sender.supportSimpleArguments(...input)).to.eventually.deep.equal(input)
  })
})
