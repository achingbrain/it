# it-batched-bytes <!-- omit in toc -->

[![codecov](https://img.shields.io/codecov/c/github/achingbrain/it.svg?style=flat-square)](https://codecov.io/gh/achingbrain/it)
[![CI](https://img.shields.io/github/actions/workflow/status/achingbrain/it/js-test-and-release.yml?branch=master\&style=flat-square)](https://github.com/achingbrain/it/actions/workflows/js-test-and-release.yml?query=branch%3Amaster)

> Takes an async iterator that emits byte arrays and emits them as fixed size batches

## Table of contents <!-- omit in toc -->

- [Install](#install)
  - [Browser `<script>` tag](#browser-script-tag)
- [Usage](#usage)
- [License](#license)
- [Contribution](#contribution)

## Install

```console
$ npm i it-batched-bytes
```

### Browser `<script>` tag

Loading this module through a script tag will make it's exports available as `ItBatchedBytes` in the global namespace.

```html
<script src="https://unpkg.com/it-batched-bytes/dist/index.min.js"></script>
```

The final batch may be smaller than the max.

## Usage

```javascript
import batch from 'it-batched-bytes'
import all from 'it-all'

// This can also be an iterator, generator, etc
const values = [
  Uint8Array.from([0]),
  Uint8Array.from([1]),
  Uint8Array.from([2]),
  Uint8Array.from([3]),
  Uint8Array.from([4])
]
const batchSize = 2

const result = all(batch(values, { size: batchSize }))

console.info(result) // [0, 1], [2, 3], [4]
```

Async sources must be awaited:

```javascript
import batch from 'it-batched-bytes'
import all from 'it-all'

const values = async function * () {
  yield Uint8Array.from([0])
  yield Uint8Array.from([1])
  yield Uint8Array.from([2])
  yield Uint8Array.from([3])
  yield Uint8Array.from([4])
}
const batchSize = 2

const result = await all(batch(values, { size: batchSize }))

console.info(result) // [0, 1], [2, 3], [4]
```

## License

Licensed under either of

- Apache 2.0, ([LICENSE-APACHE](LICENSE-APACHE) / <http://www.apache.org/licenses/LICENSE-2.0>)
- MIT ([LICENSE-MIT](LICENSE-MIT) / <http://opensource.org/licenses/MIT>)

## Contribution

Unless you explicitly state otherwise, any contribution intentionally submitted for inclusion in the work by you, as defined in the Apache-2.0 license, shall be dual licensed as above, without any additional terms or conditions.
