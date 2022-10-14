# it-parallel-batch <!-- omit in toc -->

[![codecov](https://img.shields.io/codecov/c/github/achingbrain/it.svg?style=flat-square)](https://codecov.io/gh/achingbrain/it)
[![CI](https://img.shields.io/github/workflow/status/achingbrain/it/test%20&%20maybe%20release/master?style=flat-square)](https://github.com/achingbrain/it/actions/workflows/js-test-and-release.yml)

> Takes an async iterator that emits promise-returning functions, invokes them in parallel and emits the results in the same order as the input

## Table of contents <!-- omit in toc -->

- [Install](#install)
- [Usage](#usage)
- [License](#license)
- [Contribute](#contribute)

## Install

```console
$ npm i it-parallel-batch
```

The final batch may be smaller than the batch size.

## Usage

```javascript
import parallelBatch from 'it-parallel-batch'
import all from 'it-all'
import delay from 'delay'

// This can also be an iterator, async iterator, generator, etc
const input = [
  async () => {
    await delay(500)

    return 1
  },
  async () => {
    await delay(200)

    return 2
  },
  async () => {
    await delay(100)

    return 3
  }
]

const batchSize = 2

const result = await all(parallelBatch(input, batchSize))

console.info(result) // [1, 2, 3]
```

## License

Licensed under either of

- Apache 2.0, ([LICENSE-APACHE](LICENSE-APACHE) / <http://www.apache.org/licenses/LICENSE-2.0>)
- MIT ([LICENSE-MIT](LICENSE-MIT) / <http://opensource.org/licenses/MIT>)

## Contribute

Unless you explicitly state otherwise, any contribution intentionally submitted for inclusion in the work by you, as defined in the Apache-2.0 license, shall be dual licensed as above, without any additional terms or conditions.
