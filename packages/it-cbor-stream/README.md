# it-cbor-stream

[![codecov](https://img.shields.io/codecov/c/github/achingbrain/it.svg?style=flat-square)](https://codecov.io/gh/achingbrain/it)
[![CI](https://img.shields.io/github/actions/workflow/status/achingbrain/it/js-test-and-release.yml?branch=main\&style=flat-square)](https://github.com/achingbrain/it/actions/workflows/js-test-and-release.yml?query=branch%3Amain)

> Read and write CBOR messages over a duplex stream

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

This module makes it easy to send and receive length-prefixed CBOR encoded
messages over streams.

## Example

```typescript
import { cborStream } from 'it-cbor-stream'
import { MessageType } from './src/my-message-type.js'

const stream = cborStream(duplex)

// write a message to the stream
stream.write({
  foo: 'bar'
})

// read a message from the stream
const res = await stream.read()
```

# Install

```console
$ npm i it-cbor-stream
```

## Browser `<script>` tag

Loading this module through a script tag will make its exports available as `ItCborStream` in the global namespace.

```html
<script src="https://unpkg.com/it-cbor-stream/dist/index.min.js"></script>
```

# API Docs

- <https://achingbrain.github.io/it/modules/it_cbor_stream.html>

# License

Licensed under either of

- Apache 2.0, ([LICENSE-APACHE](https://github.com/achingbrain/it/blob/main/packages/it-cbor-stream/LICENSE-APACHE) / <http://www.apache.org/licenses/LICENSE-2.0>)
- MIT ([LICENSE-MIT](https://github.com/achingbrain/it/blob/main/packages/it-cbor-stream/LICENSE-MIT) / <http://opensource.org/licenses/MIT>)

# Contribution

Unless you explicitly state otherwise, any contribution intentionally submitted for inclusion in the work by you, as defined in the Apache-2.0 license, shall be dual licensed as above, without any additional terms or conditions.
