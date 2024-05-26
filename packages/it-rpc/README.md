# it-rpc

[![codecov](https://img.shields.io/codecov/c/github/achingbrain/it.svg?style=flat-square)](https://codecov.io/gh/achingbrain/it)
[![CI](https://img.shields.io/github/actions/workflow/status/achingbrain/it/js-test-and-release.yml?branch=main\&style=flat-square)](https://github.com/achingbrain/it/actions/workflows/js-test-and-release.yml?query=branch%3Amain)

> Schema-free RPC over async iterables

# About

<!--

!IMPORTANT!

Everything in this README between "# About" and "# Install" is automatically
generated and will be overwritten the next time the doc generator is run.

To make changes to this section, please update the @packageDocumentation section
of src/index.js or src/index.ts

To experiment with formatting, please run "npm run docs" from the root of this
repo and examine the changes made.

-->

Your RPC objects must follow a few rules:

1. All RPC methods must return a promise or an async generator
2. Property access on the RPC object is not supported
3. RPC Arguments must not be promises (though may be functions that return promises)
4. The values resolved/yielded from an RPC function must be serializable (e.g. contain no functions) unless custom types are used (see <a href="#custom-types">Custom Types</a> below)
5. AsyncGenerators returned from RPC methods must be either read to completion, or their `.return`/`.throw` methods invoked
6. Callback functions (e.g. functions passed as arguments) should return promises or async generators
7. Callback functions may return `void`, but if so they must not throw

## Example - Getting started

```ts
import { rpc } from 'it-rpc'

// the invocation target interface - used by the client and the server
interface Target {
  sayHello(): Promise<string>
}

// the target implementation, lives on the server side
const target: Target = {
  async sayHello () {
    return 'hello'
  }
}

// create client and server
const server = rpc()
const client = rpc()

// pipe the streams together
void server.sink(client.source)
void client.sink(server.source)

// a string that is the same on both the server and the client
const objectName = 'target'

// expose target implementation to RPC calls on the server side
server.createTarget(objectName, target)

// create a client-side version of target
const clientTarget = client.createClient<Target>(objectName)

// invoke a remote method
await clientTarget.sayHello() // 'hello'
```

## Example - Streaming data from the server to the client

```ts
import { rpc } from 'it-rpc'

interface Target {
  streamingMethod(): AsyncGenerator<Uint8Array>
}

const target: Target = {
  async * streamingMethod () {
    yield Uint8Array.from([0, 1, 2, 3])
    yield Uint8Array.from([4, 5, 6, 7])
  }
}

const server = rpc()
const client = rpc()
void server.sink(client.source)
void client.sink(server.source)

const objectName = 'target'
server.createTarget(objectName, target)

const clientTarget = client.createClient<Target>(objectName)

for await (const buf of clientTarget.streamingMethod()) {
  console.info(buf)
  // Uint8Array([0, 1, 2, 3])
  // Uint8Array([4, 5, 6, 7])
}
```

## Example - Aborting remote method invocations

Any abort signals passed as arguments will have equivalents passed on to the
remote method invocation and these will fire their `abort` event when the
client side signal fires.

```ts
import { rpc } from 'it-rpc'

interface Target {
  slowStream(arg: { signal: AbortSignal }): AsyncGenerator<Uint8Array>
}

const target: Target = {
  async * slowStream () {
    await new Promise<void>((resolve) => {
      setTimeout(() => {
        resolve()
      }, 5000)
    })
    yield Uint8Array.from([0, 1, 2, 3])
    yield Uint8Array.from([4, 5, 6, 7])
  }
}

const server = rpc()
const client = rpc()
void server.sink(client.source)
void client.sink(server.source)

const objectName = 'target'
server.createTarget(objectName, target)

const clientTarget = client.createClient<Target>(objectName)

const signal = AbortSignal.timeout(1000)

for await (const buf of clientTarget.slowStream({ signal })) {
  console.info(buf)
  // explodes after 1s
}
```

## Custom types

It is possible to extend `it-rpc` to support serializing/deserializing custom types by passing `ValueCodec`s to the constructor.

Each `ValueCodec` needs a unique `type` field which identifies the value type on the wire.

`it-rpc` uses value types starting at `1024` and has a catch-all `2147483647` type which resolves to plain objects.

You should define your type values higher than the max value `it-rpc` uses (`2048` is a safe value) but lower than the catch-all type value.

Matching codecs are searched for in `type` order so you can override the built-in codecs by specifying a `type` field lower than `1024`.

> \[!IMPORTANT]
> Both the server and the client must be configured with the same set of custom `ValueCodec`s

## Example - Custom Types

```ts
import { encode, decode } from 'cborg'
import { rpc } from 'it-rpc'
import type { ValueCodec } from 'it-rpc'

// a custom type we want to encode
class MyClass {
  field: string

  constructor (val: string) {
    this.field = val
  }

  getField () {
    return this.field
  }
}

// our custom codec
const codec: ValueCodec<MyClass> = {
  type: 2048,
  canEncode: (val) => val instanceof MyClass,
  encode: (val) => encode({ field: val.getField() }),
  decode: (buf) => {
    const decoded = decode(buf)

    return new MyClass(decoded.field)
  }
}

// configure the server/client with the custom codec
const server = rpc({
  valueCodecs: [
    codec
  ]
})
const client = rpc({
  valueCodecs: [
    codec
  ]
})
void server.sink(client.source)
void client.sink(server.source)

interface Target {
  getFieldFromArg(arg: MyClass): Promise<string>
}

const target: Target = {
  async getFieldFromArg (arg) {
    return arg.getField()
  }
}

const objectName = 'target'
server.createTarget(objectName, target)

const clientTarget = client.createClient<Target>(objectName)

const val = new MyClass('hello')

await clientTarget.getFieldFromArg(val) // 'hello'
```

# Install

```console
$ npm i it-rpc
```

## Browser `<script>` tag

Loading this module through a script tag will make it's exports available as `ItRpc` in the global namespace.

```html
<script src="https://unpkg.com/it-rpc/dist/index.min.js"></script>
```

# API Docs

- <https://achingbrain.github.io/it/modules/it_rpc.html>

# License

Licensed under either of

- Apache 2.0, ([LICENSE-APACHE](https://github.com/achingbrain/it/blob/main/packages/it-rpc/LICENSE-APACHE) / <http://www.apache.org/licenses/LICENSE-2.0>)
- MIT ([LICENSE-MIT](https://github.com/achingbrain/it/blob/main/packages/it-rpc/LICENSE-MIT) / <http://opensource.org/licenses/MIT>)

# Contribution

Unless you explicitly state otherwise, any contribution intentionally submitted for inclusion in the work by you, as defined in the Apache-2.0 license, shall be dual licensed as above, without any additional terms or conditions.
