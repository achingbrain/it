# it-skip <!-- omit in toc -->

[![codecov](https://img.shields.io/codecov/c/github/achingbrain/it.svg?style=flat-square)](https://codecov.io/gh/achingbrain/it)
[![CI](https://img.shields.io/github/workflow/status/achingbrain/it/test%20&%20maybe%20release/master?style=flat-square)](https://github.com/achingbrain/it/actions/workflows/js-test-and-release.yml)

> Skip items from an iterable

## Table of contents <!-- omit in toc -->

- [Install](#install)
- [Usage](#usage)
- [License](#license)
- [Contribute](#contribute)

## Install

```console
$ npm i it-skip
```

For when you are only interested in later values from an iterable.

## Usage

```javascript
import take from 'it-skip'
import all from 'it-all'

// This can also be an iterator, async iterator, generator, etc
const values = [0, 1, 2, 3, 4]

const arr = await all(skip(values, 2))

console.info(arr) // 2, 3, 4
```

## License

Licensed under either of

- Apache 2.0, ([LICENSE-APACHE](LICENSE-APACHE) / <http://www.apache.org/licenses/LICENSE-2.0>)
- MIT ([LICENSE-MIT](LICENSE-MIT) / <http://opensource.org/licenses/MIT>)

## Contribute

Unless you explicitly state otherwise, any contribution intentionally submitted for inclusion in the work by you, as defined in the Apache-2.0 license, shall be dual licensed as above, without any additional terms or conditions.