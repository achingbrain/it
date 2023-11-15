[![codecov](https://img.shields.io/codecov/c/github/achingbrain/it.svg?style=flat-square)](https://codecov.io/gh/achingbrain/it)
[![CI](https://img.shields.io/github/actions/workflow/status/achingbrain/it/js-test-and-release.yml?branch=master\&style=flat-square)](https://github.com/achingbrain/it/actions/workflows/js-test-and-release.yml?query=branch%3Amaster)

> Read and write protobuf messages over a duplex stream

# About

This module makes it easy to send and receive length-prefixed Protobuf encoded
messages over streams.

## Example

```typescript
import { pbStream } from 'it-protobuf-stream'
import { MessageType } from './src/my-message-type.js'

// RequestType and ResponseType have been generate from `.proto` files and have
// `.encode` and `.decode` methods for serialization/deserialization

const stream = pbStream(duplex)

// write a message to the stream
stream.write({
  foo: 'bar'
}, MessageType)

// read a message from the stream
const res = await stream.read(MessageType)
```

# Install

```console
$ npm i it-protobuf-stream
```

## Browser `<script>` tag

Loading this module through a script tag will make it's exports available as `ItProtobufStream` in the global namespace.

```html
<script src="https://unpkg.com/it-protobuf-stream/dist/index.min.js"></script>
```

# License

Licensed under either of

- Apache 2.0, ([LICENSE-APACHE](LICENSE-APACHE) / <http://www.apache.org/licenses/LICENSE-2.0>)
- MIT ([LICENSE-MIT](LICENSE-MIT) / <http://opensource.org/licenses/MIT>)

# Contribution

Unless you explicitly state otherwise, any contribution intentionally submitted for inclusion in the work by you, as defined in the Apache-2.0 license, shall be dual licensed as above, without any additional terms or conditions.
