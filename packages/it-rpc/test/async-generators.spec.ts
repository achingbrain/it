import { expect } from 'aegir/chai'
import all from 'it-all'
import drain from 'it-drain'
import { rpc } from '../src/index.js'
import type { RPC } from '../src/index.js'

const target = {
  async * asyncGenerator () {
    yield 1
    yield 2
    yield 3
    yield 4
  },
  async * yieldsValues (gen: AsyncGenerator<any, any, any>): AsyncGenerator<any, any, any> {
    yield * gen
  },
  async * yieldsArgValues (arg: { foo: { gen: AsyncGenerator<any> } }) {
    yield * arg.foo.gen
  },
  async * yieldsValuesWithCatch (gen: AsyncGenerator<any, any, any>): AsyncGenerator<any, any, any> {
    for await (const i of gen) {
      try {
        yield i
      } catch {

      }
    }
  }
}

describe('async generators', () => {
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

  it('should use `.next` from the async generator protocol', async () => {
    const gen = sender.yieldsArgValues({
      foo: {
        gen: (async function * () {
          yield * [1, 2, 3, 4]
        })()
      }
    })

    const result = await gen.next()

    expect(result).to.deep.equal({ done: false, value: 1 })

    await drain(gen)
  })

  it('should use `.return` from the async generator protocol', async () => {
    const gen = sender.yieldsValues((async function * () {
      yield * [1, 2, 3, 4]
    })())

    const returned = 'return value'
    const result = await gen.return(returned)

    expect(result).to.deep.equal({ done: true, value: returned })
  })

  it('should use `.throw` from the async generator protocol', async () => {
    const gen = sender.yieldsValues((async function * () {
      yield * [1, 2, 3, 4]
    })())

    const err = new Error('Urk!')

    await expect(gen.throw(err)).to.eventually.be.rejected()
      .with.property('message', err.message)
    await expect(drain(gen)).to.eventually.be.rejected()
      .with.property('message', err.message)
  })

  it('should catch thrown errors and return', async () => {
    const gen = sender.yieldsValuesWithCatch((async function * () {
      yield * [1, 2, 3, 4]
    })())

    await expect(gen.next()).to.eventually.deep.equal({ done: false, value: 1 })
    await expect(gen.throw(new Error('Urk!'))).to.eventually.deep.equal({ done: false, value: 2 })
    await expect(all(gen)).to.eventually.deep.equal([3, 4])
  })

  it('should be able to break out of loops without leaking memory', async () => {
    const gen = sender.asyncGenerator()
    const values = []

    for await (const val of gen) {
      values.push(val)
      // exit loop before finishing generator
      if (val === 2) {
        break
      }
    }

    // should have read some values
    expect(values).to.deep.equal([1, 2])

    // afterEach checks there are no lingering invocations
  })
})
