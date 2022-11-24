# it-sort <!-- omit in toc -->

[![codecov](https://img.shields.io/codecov/c/github/achingbrain/it.svg?style=flat-square)](https://codecov.io/gh/achingbrain/it)
[![CI](https://img.shields.io/github/workflow/status/achingbrain/it/test%20&%20maybe%20release/master?style=flat-square)](https://github.com/achingbrain/it/actions/workflows/js-test-and-release.yml)

> Collects all values from an async iterator, sorts them using the passed function and yields them

## Table of contents <!-- omit in toc -->

- [Install](#install)
- [Usage](#usage)
- [License](#license)
- [Contribute](#contribute)

## Install

```console
$ npm i it-sort
```

## Usage

```javascript
import sort from 'it-sort'
import all from 'it-all'

const sorter = (a, b) => {
  return a.localeCompare(b)
}

// This can also be an iterator, async iterator, generator, etc
const values = ['foo', 'bar']

const arr = await all(sort(values, sorter))

console.info(arr) // 'bar', 'foo'
```

## License

Licensed under either of

- Apache 2.0, ([LICENSE-APACHE](LICENSE-APACHE) / <http://www.apache.org/licenses/LICENSE-2.0>)
- MIT ([LICENSE-MIT](LICENSE-MIT) / <http://opensource.org/licenses/MIT>)

## Contribute

Unless you explicitly state otherwise, any contribution intentionally submitted for inclusion in the work by you, as defined in the Apache-2.0 license, shall be dual licensed as above, without any additional terms or conditions.