import { expect } from 'aegir/chai'
import { encode, decode } from 'cborg'
import { rpc } from '../src/index.js'
import type { RPC, ValueCodec } from '../src/index.js'

class MyClass {
  field: string

  constructor (val: string) {
    this.field = val
  }

  getField (): string {
    return this.field
  }
}

const target = {
  async getFieldFromArg (arg: MyClass) {
    return arg.getField()
  }
}

const codec: ValueCodec<MyClass> = {
  type: 2048,
  canEncode: (val) => val instanceof MyClass,
  encode: (val) => encode({ field: val.getField() }),
  decode: (buf) => {
    const decoded = decode(buf)

    return new MyClass(decoded.field)
  }
}

describe('basics', () => {
  let serverRPC: RPC
  let clientRPC: RPC
  let sender: typeof target

  beforeEach(() => {
    // create server and client
    serverRPC = rpc({
      valueCodecs: [
        codec
      ]
    })
    clientRPC = rpc({
      valueCodecs: [
        codec
      ]
    })

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

  it('should support custom values', async () => {
    const field = 'hello there'
    const val = new MyClass(field)

    // invoke methods on target
    await expect(sender.getFieldFromArg(val)).to.eventually.equal(field)
  })
})
