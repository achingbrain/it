# it-flat-batch <!-- omit in toc -->

[![codecov](https://img.shields.io/codecov/c/github/achingbrain/it.svg?style=flat-square)](https://codecov.io/gh/achingbrain/it)
[![CI](https://img.shields.io/github/actions/workflow/status/achingbrain/it/js-test-and-release.yml?branch=master\&style=flat-square)](https://github.com/achingbrain/it/actions/workflows/js-test-and-release.yml?query=branch%3Amaster)

> Takes an async iterator that emits variable length arrays and emits them as fixed size batches

## Table of contents <!-- omit in toc -->

- [Install](#install)
  - [Browser `<script>` tag](#browser-script-tag)
- [Usage](#usage)
- [License](#license)
- [Contribution](#contribution)

## Install

```console
$ npm i it-flat-batch
```

### Browser `<script>` tag

Loading this module through a script tag will make it's exports available as `ItFlatBatch` in the global namespace.

```html
<script src="https://unpkg.com/it-flat-batch/dist/index.min.js"></script>
```

The final batch may be smaller than requested batch size.

## Usage

```javascript
import batch from 'it-flat-batch'
import all from 'it-all'

// This can also be an iterator, async iterator, generator, etc
const values = [[0, 1, 2], [3], [4]]
const batchSize = 2

const result = await all(batch(values, batchSize))

console.info(result) // [0, 1], [2, 3], [4]
```

## License

Licensed under either of

- Apache 2.0, ([LICENSE-APACHE](LICENSE-APACHE) / <http://www.apache.org/licenses/LICENSE-2.0>)
- MIT ([LICENSE-MIT](LICENSE-MIT) / <http://opensource.org/licenses/MIT>)

## Contribution

Unless you explicitly state otherwise, any contribution intentionally submitted for inclusion in the work by you, as defined in the Apache-2.0 license, shall be dual licensed as above, without any additional terms or conditions.
