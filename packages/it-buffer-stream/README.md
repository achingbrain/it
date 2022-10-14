# it-buffer-stream <!-- omit in toc -->

[![codecov](https://img.shields.io/codecov/c/github/achingbrain/it.svg?style=flat-square)](https://codecov.io/gh/achingbrain/it)
[![CI](https://img.shields.io/github/workflow/status/achingbrain/it/test%20&%20maybe%20release/master?style=flat-square)](https://github.com/achingbrain/it/actions/workflows/js-test-and-release.yml)

> An async iterator that emits buffers containing bytes up to a certain length

## Table of contents <!-- omit in toc -->

- [Install](#install)
- [Usage](#usage)
- [License](#license)
- [Contribute](#contribute)

## Install

```console
$ npm i it-buffer-stream
```

## Usage

```javascript
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

## Contribute

Unless you explicitly state otherwise, any contribution intentionally submitted for inclusion in the work by you, as defined in the Apache-2.0 license, shall be dual licensed as above, without any additional terms or conditions.
