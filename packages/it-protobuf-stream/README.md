# it-protobuf-stream <!-- omit in toc -->

[![codecov](https://img.shields.io/codecov/c/github/achingbrain/it.svg?style=flat-square)](https://codecov.io/gh/achingbrain/it)
[![CI](https://img.shields.io/github/actions/workflow/status/achingbrain/it/js-test-and-release.yml?branch=master\&style=flat-square)](https://github.com/achingbrain/it/actions/workflows/js-test-and-release.yml?query=branch%3Amaster)

> Read and write protobuf messages over a duplex stream

## Table of contents <!-- omit in toc -->

- [Install](#install)
  - [Browser `<script>` tag](#browser-script-tag)
- [Usage](#usage)
- [License](#license)
- [Contribution](#contribution)

## Install

```console
$ npm i it-protobuf-stream
```

### Browser `<script>` tag

Loading this module through a script tag will make it's exports available as `ItProtobufStream` in the global namespace.

```html
<script src="https://unpkg.com/it-protobuf-stream/dist/index.min.js"></script>
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
import { pbStream } from 'it-protobuf-stream'

const stream = pbStream(duplex)

// read a message from the stream
await stream.read(def)

// write a message into the stream
await stream.write(buf, def)

//.. etc
```

## License

Licensed under either of

- Apache 2.0, ([LICENSE-APACHE](LICENSE-APACHE) / <http://www.apache.org/licenses/LICENSE-2.0>)
- MIT ([LICENSE-MIT](LICENSE-MIT) / <http://opensource.org/licenses/MIT>)

## Contribution

Unless you explicitly state otherwise, any contribution intentionally submitted for inclusion in the work by you, as defined in the Apache-2.0 license, shall be dual licensed as above, without any additional terms or conditions.
