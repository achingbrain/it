# it-split <!-- omit in toc -->

[![codecov](https://img.shields.io/codecov/c/github/achingbrain/it.svg?style=flat-square)](https://codecov.io/gh/achingbrain/it)
[![CI](https://img.shields.io/github/workflow/status/achingbrain/it/test%20&%20maybe%20release/master?style=flat-square)](https://github.com/achingbrain/it/actions/workflows/js-test-and-release.yml)

> Splits Uint8Arrays emitted by an (async) iterable by a delimiter

## Table of contents <!-- omit in toc -->

- [Install](#install)
- [Usage](#usage)
- [License](#license)
- [Contribute](#contribute)

## Install

```console
$ npm i it-split
```

## Usage

```javascript
import split from 'it-split'

const encoder = new TextEncoder()

// This can also be an iterator, async iterator, generator, etc
const values = [
  encoder.encode('hello\nwor'),
  encoder.encode('ld')
]

const arr = await all(split(values))

console.info(arr) // [encoder.encode('hello'), encoder.encode('world')]
```

You can also split by arbitrary delimiters:

```javascript
const values = [
  Uint8Array.from([0, 1, 2, 3]),
  Uint8Array.from([0, 1, 2, 3]),
  Uint8Array.from([1, 1, 2])
]
const delimiter = Uint8Array.from([1, 2])

const arr = await all(split(values, {
  delimiter
}))

console.info(arr) // [ Buffer.from([0]), Buffer.from([3, 0]), Buffer.from([3, 1]) ]
```

## License

Licensed under either of

- Apache 2.0, ([LICENSE-APACHE](LICENSE-APACHE) / <http://www.apache.org/licenses/LICENSE-2.0>)
- MIT ([LICENSE-MIT](LICENSE-MIT) / <http://opensource.org/licenses/MIT>)

## Contribute

Unless you explicitly state otherwise, any contribution intentionally submitted for inclusion in the work by you, as defined in the Apache-2.0 license, shall be dual licensed as above, without any additional terms or conditions.
