# it-buffer-stream

[![codecov](https://img.shields.io/codecov/c/github/achingbrain/it.svg?style=flat-square)](https://codecov.io/gh/achingbrain/it)
[![CI](https://img.shields.io/github/actions/workflow/status/achingbrain/it/js-test-and-release.yml?branch=main\&style=flat-square)](https://github.com/achingbrain/it/actions/workflows/js-test-and-release.yml?query=branch%3Amain)

> An async iterator that emits buffers containing bytes up to a certain length

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

Generate a stream of buffers, useful for testing purposes.

## Example

```javascript
import bufferStream from 'it-buffer-stream'

const totalLength = //... a big number

// all options are optional, defaults are shown
const options = {
  chunkSize: 4096, // how many bytes will be in each buffer
  collector: (buffer) => {
    // will be called as each buffer is generated. the final buffer
    // may be smaller than `chunkSize`
  },
  generator: async (size) => {
    // return a promise that resolves to a buffer of length `size`
    //
    // if omitted, `Promise.resolve(crypto.randomBytes(size))` will be used
  }
}

let buffers = []

for await (buf of bufferStream(totalLength, options)) {
  buffers.push(buf)
}

// `buffers` is an array of Buffers the combined length of which === totalLength
```

# Install

```console
$ npm i it-buffer-stream
```

## Browser `<script>` tag

Loading this module through a script tag will make its exports available as `ItBufferStream` in the global namespace.

```html
<script src="https://unpkg.com/it-buffer-stream/dist/index.min.js"></script>
```

# API Docs

- <https://achingbrain.github.io/it/modules/it_buffer_stream.html>

# License

Licensed under either of

- Apache 2.0, ([LICENSE-APACHE](https://github.com/achingbrain/it/blob/main/packages/it-buffer-stream/LICENSE-APACHE) / <http://www.apache.org/licenses/LICENSE-2.0>)
- MIT ([LICENSE-MIT](https://github.com/achingbrain/it/blob/main/packages/it-buffer-stream/LICENSE-MIT) / <http://opensource.org/licenses/MIT>)

# Contribution

Unless you explicitly state otherwise, any contribution intentionally submitted for inclusion in the work by you, as defined in the Apache-2.0 license, shall be dual licensed as above, without any additional terms or conditions.
