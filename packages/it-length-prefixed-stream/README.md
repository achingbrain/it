[![codecov](https://img.shields.io/codecov/c/github/achingbrain/it.svg?style=flat-square)](https://codecov.io/gh/achingbrain/it)
[![CI](https://img.shields.io/github/actions/workflow/status/achingbrain/it/js-test-and-release.yml?branch=master\&style=flat-square)](https://github.com/achingbrain/it/actions/workflows/js-test-and-release.yml?query=branch%3Amaster)

> Read and write length-prefixed byte arrays over a duplex stream

# About

This module makes it easy to send and receive length-prefixed byte arrays over streams.

## Example

```typescript
import { lpStream } from 'it-length-prefixed-stream'

const stream = lpStream(duplex)

// read the next length-prefixed chunk
const bytes = await stream.read()

// write a length-prefixed chunk
await stream.write(Uint8Array.from([0, 1, 2, 3, 4]))

// write several chunks, all individually length-prefixed
await stream.writeV([
  Uint8Array.from([0, 1, 2, 3, 4]),
  Uint8Array.from([5, 6, 7, 8, 9])
])
```

# Install

```console
$ npm i it-length-prefixed-stream
```

## Browser `<script>` tag

Loading this module through a script tag will make it's exports available as `ItLengthPrefixedStream` in the global namespace.

```html
<script src="https://unpkg.com/it-length-prefixed-stream/dist/index.min.js"></script>
```

# License

Licensed under either of

- Apache 2.0, ([LICENSE-APACHE](LICENSE-APACHE) / <http://www.apache.org/licenses/LICENSE-2.0>)
- MIT ([LICENSE-MIT](LICENSE-MIT) / <http://opensource.org/licenses/MIT>)

# Contribution

Unless you explicitly state otherwise, any contribution intentionally submitted for inclusion in the work by you, as defined in the Apache-2.0 license, shall be dual licensed as above, without any additional terms or conditions.
