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

Schema-free RPC over async iterables.

Your RPC objects must follow a few rules:

1. All invoked methods, or functions passed as arguments (or properties of arguments) must return a promise or an async generator
2. No arguments or properties of arguments can be promises
3. Functions cannot be returned from RPC methods

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
