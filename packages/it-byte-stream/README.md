# it-byte-stream <!-- omit in toc -->

[![codecov](https://img.shields.io/codecov/c/github/achingbrain/it.svg?style=flat-square)](https://codecov.io/gh/achingbrain/it)
[![CI](https://img.shields.io/github/actions/workflow/status/achingbrain/it/js-test-and-release.yml?branch=master\&style=flat-square)](https://github.com/achingbrain/it/actions/workflows/js-test-and-release.yml?query=branch%3Amaster)

> Read and write arbitrary bytes over a duplex stream

## Table of contents <!-- omit in toc -->

- [Install](#install)
  - [Browser `<script>` tag](#browser-script-tag)
- [Usage](#usage)
- [License](#license)
- [Contribution](#contribution)

## Install

```console
$ npm i it-byte-stream
```

### Browser `<script>` tag

Loading this module through a script tag will make it's exports available as `ItByteStream` in the global namespace.

```html
<script src="https://unpkg.com/it-byte-stream/dist/index.min.js"></script>
```

- [Install](#install)
  - [Browser `<script>` tag](#browser-script-tag)
- [Usage](#usage)
- [License](#license)
- [Contribution](#contribution)

```sh
> npm install it-pb-stream
```

## Usage

```js
import { byteStream } from 'it-byte-stream'

const stream = byteStream(duplex)

// read next available chunk
await stream.read()

// read next 5 bytes only
await stream.read(5)

// write a Uint8Array
await stream.write(buf)

//.. etc
```

## License

Licensed under either of

- Apache 2.0, ([LICENSE-APACHE](LICENSE-APACHE) / <http://www.apache.org/licenses/LICENSE-2.0>)
- MIT ([LICENSE-MIT](LICENSE-MIT) / <http://opensource.org/licenses/MIT>)

## Contribution

Unless you explicitly state otherwise, any contribution intentionally submitted for inclusion in the work by you, as defined in the Apache-2.0 license, shall be dual licensed as above, without any additional terms or conditions.
