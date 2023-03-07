# it-buffer-stream <!-- omit in toc -->

[![codecov](https://img.shields.io/codecov/c/github/achingbrain/it.svg?style=flat-square)](https://codecov.io/gh/achingbrain/it)
[![CI](https://img.shields.io/github/actions/workflow/status/achingbrain/it/js-test-and-release.yml?branch=master\&style=flat-square)](https://github.com/achingbrain/it/actions/workflows/js-test-and-release.yml?query=branch%3Amaster)

> An async iterator that emits buffers containing bytes up to a certain length

## Table of contents <!-- omit in toc -->

- [Install](#install)
  - [Browser `<script>` tag](#browser-script-tag)
- [Usage](#usage)
- [License](#license)
- [Contribution](#contribution)

## Install

```console
$ npm i it-buffer-stream
```

### Browser `<script>` tag

Loading this module through a script tag will make it's exports available as `ItBufferStream` in the global namespace.

```html
<script src="https://unpkg.com/it-buffer-stream/dist/index.min.js"></script>
```

## Usage

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

## License

Licensed under either of

- Apache 2.0, ([LICENSE-APACHE](LICENSE-APACHE) / <http://www.apache.org/licenses/LICENSE-2.0>)
- MIT ([LICENSE-MIT](LICENSE-MIT) / <http://opensource.org/licenses/MIT>)

## Contribution

Unless you explicitly state otherwise, any contribution intentionally submitted for inclusion in the work by you, as defined in the Apache-2.0 license, shall be dual licensed as above, without any additional terms or conditions.
