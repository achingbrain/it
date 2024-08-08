# it-byte-stream

[![codecov](https://img.shields.io/codecov/c/github/achingbrain/it.svg?style=flat-square)](https://codecov.io/gh/achingbrain/it)
[![CI](https://img.shields.io/github/actions/workflow/status/achingbrain/it/js-test-and-release.yml?branch=main\&style=flat-square)](https://github.com/achingbrain/it/actions/workflows/js-test-and-release.yml?query=branch%3Amain)

> Read and write arbitrary bytes over a duplex stream

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

This module makes it easy to send and receive bytes over streams.

## Example

```typescript
import { byteStream } from 'it-byte-stream'

const stream = byteStream(duplex)

// read the next chunk
const bytes = await stream.read()

// read the next five bytes
const fiveBytes = await stream.read(5)

// write bytes into the stream
await stream.write(Uint8Array.from([0, 1, 2, 3, 4]))
```

# Install

```console
$ npm i it-byte-stream
```

## Browser `<script>` tag

Loading this module through a script tag will make its exports available as `ItByteStream` in the global namespace.

```html
<script src="https://unpkg.com/it-byte-stream/dist/index.min.js"></script>
```

# API Docs

- <https://achingbrain.github.io/it/modules/it_byte_stream.html>

# License

Licensed under either of

- Apache 2.0, ([LICENSE-APACHE](https://github.com/achingbrain/it/blob/main/packages/it-byte-stream/LICENSE-APACHE) / <http://www.apache.org/licenses/LICENSE-2.0>)
- MIT ([LICENSE-MIT](https://github.com/achingbrain/it/blob/main/packages/it-byte-stream/LICENSE-MIT) / <http://opensource.org/licenses/MIT>)

# Contribution

Unless you explicitly state otherwise, any contribution intentionally submitted for inclusion in the work by you, as defined in the Apache-2.0 license, shall be dual licensed as above, without any additional terms or conditions.
