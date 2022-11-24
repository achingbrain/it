# it-merge <!-- omit in toc -->

[![codecov](https://img.shields.io/codecov/c/github/achingbrain/it.svg?style=flat-square)](https://codecov.io/gh/achingbrain/it)
[![CI](https://img.shields.io/github/workflow/status/achingbrain/it/test%20&%20maybe%20release/master?style=flat-square)](https://github.com/achingbrain/it/actions/workflows/js-test-and-release.yml)

> Treat one or more iterables as a single iterable

## Table of contents <!-- omit in toc -->

- [Install](#install)
- [Usage](#usage)
- [License](#license)
- [Contribute](#contribute)

## Install

```console
$ npm i it-merge
```

Nb. sources are iterated over in parallel so the order of emitted items is not guaranteed.

## Usage

```javascript
import merge from 'it-merge'
import all from 'it-all'

// This can also be an iterator, async iterator, generator, etc
const values1 = [0, 1, 2, 3, 4]
const values2 = [5, 6, 7, 8, 9]

const arr = await all(merge(values1, values2))

console.info(arr) // 0, 1, 5, 6, 2, 3, 4, 7, 8, 9  <- nb. order is not guaranteed
```

## License

Licensed under either of

- Apache 2.0, ([LICENSE-APACHE](LICENSE-APACHE) / <http://www.apache.org/licenses/LICENSE-2.0>)
- MIT ([LICENSE-MIT](LICENSE-MIT) / <http://opensource.org/licenses/MIT>)

## Contribute

Unless you explicitly state otherwise, any contribution intentionally submitted for inclusion in the work by you, as defined in the Apache-2.0 license, shall be dual licensed as above, without any additional terms or conditions.