import { expect } from 'aegir/chai'
import all from 'it-all'
import { AbortError } from 'it-pushable'
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
  },
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
  async callsCallbackWithHello (arg: (arg: any) => Promise<any>) {
    return arg('hello')
  },
  async callsNestedCallbackWithHello (arg: { foo: { bar(arg: any): Promise<any> } }) {
    return arg.foo.bar('hello')
  },
  async callsNestedCallback (arg: { foo: { bar(): Promise<any> } }) {
    return arg.foo.bar()
  },
  async * asyncGenerator () {
    yield 1
    yield 2
    yield 3
    yield 4
  },
  async * yieldsValues (gen: AsyncGenerator<any>) {
    yield * gen
  },
  async * yieldsArgValues (arg: { foo: { gen: AsyncGenerator<any> } }) {
    yield * arg.foo.gen
  }
}

describe('it-rpc', () => {
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

  it('should call a callback argument', async () => {
    await expect(sender.callsCallbackWithHello(async (arg) => arg)).to.eventually.equal('hello')
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

  it('should yield all values from an async generator', async () => {
    await expect(all(sender.asyncGenerator())).to.eventually.deep.equal([1, 2, 3, 4])
  })

  it('should yield all values from an async generator passed as an argument', async () => {
    await expect(all(sender.yieldsArgValues({
      foo: {
        gen: (async function * () {
          yield * [1, 2, 3, 4]
        })()
      }
    }))).to.eventually.deep.equal([1, 2, 3, 4])
  })

  it('should abort a method invocation', async () => {
    const signal = AbortSignal.timeout(100)

    await expect(sender.throwsOnAbort({ signal })).to.eventually.be.rejected
      .with.property('type', 'aborted')
  })

  it('should allow aborting a callback invocation', async () => {
    const signal = AbortSignal.timeout(100)

    await expect(sender.callsCallback(async () => {
      return new Promise((resolve, reject) => {
        signal.addEventListener('abort', () => {
          reject(new AbortError())
        })
      })
    })).to.eventually.be.rejected
      .with.property('type', 'aborted')
  })
})
