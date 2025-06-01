# it-ndjson-stream

[![codecov](https://img.shields.io/codecov/c/github/achingbrain/it.svg?style=flat-square)](https://codecov.io/gh/achingbrain/it)
[![CI](https://img.shields.io/github/actions/workflow/status/achingbrain/it/js-test-and-release.yml?branch=main\&style=flat-square)](https://github.com/achingbrain/it/actions/workflows/js-test-and-release.yml?query=branch%3Amain)

> Read and write ndjson messages over a duplex stream

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

This module makes it easy to send and receive ndjson messages over streams.

## Example

```typescript
import { ndjsonStream } from 'it-ndjson-stream'

const stream = ndjsonStream(duplex)

// read the next message
const obj = await stream.read()

// write a message
await stream.write({ hello: 'world' })

// write several messages
await stream.writeV([
  { hello: 'world' },
  { how: 'are you' }
])
```

# Install

```console
$ npm i it-ndjson-stream
```

## Browser `<script>` tag

Loading this module through a script tag will make its exports available as `ItNdjsonStream` in the global namespace.

```html
<script src="https://unpkg.com/it-ndjson-stream/dist/index.min.js"></script>
```

# API Docs

- <https://achingbrain.github.io/it/modules/it_ndjson_stream.html>

# License

Licensed under either of

- Apache 2.0, ([LICENSE-APACHE](https://github.com/achingbrain/it/blob/main/packages/it-ndjson-stream/LICENSE-APACHE) / <http://www.apache.org/licenses/LICENSE-2.0>)
- MIT ([LICENSE-MIT](https://github.com/achingbrain/it/blob/main/packages/it-ndjson-stream/LICENSE-MIT) / <http://opensource.org/licenses/MIT>)

# Contribution

Unless you explicitly state otherwise, any contribution intentionally submitted for inclusion in the work by you, as defined in the Apache-2.0 license, shall be dual licensed as above, without any additional terms or conditions.
