# it-length-prefixed-stream <!-- omit in toc -->

[![codecov](https://img.shields.io/codecov/c/github/achingbrain/it.svg?style=flat-square)](https://codecov.io/gh/achingbrain/it)
[![CI](https://img.shields.io/github/actions/workflow/status/achingbrain/it/js-test-and-release.yml?branch=master\&style=flat-square)](https://github.com/achingbrain/it/actions/workflows/js-test-and-release.yml?query=branch%3Amaster)

> Read and write length-prefixed byte arrays over a duplex stream

## Table of contents <!-- omit in toc -->

- [Install](#install)
  - [Browser `<script>` tag](#browser-script-tag)
- [Usage](#usage)
- [License](#license)
- [Contribution](#contribution)

## Install

```console
$ npm i it-length-prefixed-stream
```

### Browser `<script>` tag

Loading this module through a script tag will make it's exports available as `ItLengthPrefixedStream` in the global namespace.

```html
<script src="https://unpkg.com/it-length-prefixed-stream/dist/index.min.js"></script>
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
import { lpStream } from 'it-length-prefixed-stream'

const stream = lpStream(duplex)

// read the next length-prefixed chunk
await stream.read()

// write a plain buffer, the length will be prefixed
await stream.write(buf)

//.. etc
```

## License

Licensed under either of

- Apache 2.0, ([LICENSE-APACHE](LICENSE-APACHE) / <http://www.apache.org/licenses/LICENSE-2.0>)
- MIT ([LICENSE-MIT](LICENSE-MIT) / <http://opensource.org/licenses/MIT>)

## Contribution

Unless you explicitly state otherwise, any contribution intentionally submitted for inclusion in the work by you, as defined in the Apache-2.0 license, shall be dual licensed as above, without any additional terms or conditions.
