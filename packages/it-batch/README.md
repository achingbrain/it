# it-batch

[![codecov](https://img.shields.io/codecov/c/github/achingbrain/it.svg?style=flat-square)](https://codecov.io/gh/achingbrain/it)
[![CI](https://img.shields.io/github/actions/workflow/status/achingbrain/it/js-test-and-release.yml?branch=main\&style=flat-square)](https://github.com/achingbrain/it/actions/workflows/js-test-and-release.yml?query=branch%3Amain)

> Takes an async iterator that emits things and emits them as fixed size batches

# About

<!--

!IMPORTANT!

Everything in this README between "# About" and "# Install" is automatically
generated and will be overwritten the next time the doc generator is run.

To make changes to this section, please update the @packageDocumentation section
of src/index.js or src/index.ts

To experiment with formatting, please run "npm run docs" from the root of this
repo and examine the changes made.

-->

The final batch may be smaller than the max.

## Example

```javascript
import batch from 'it-batch'
import all from 'it-all'

// This can also be an iterator, generator, etc
const values = [0, 1, 2, 3, 4]
const batchSize = 2

const result = all(batch(values, batchSize))

console.info(result) // [0, 1], [2, 3], [4]
```

Async sources must be awaited:

```javascript
import batch from 'it-batch'
import all from 'it-all'

const values = async function * () {
  yield * [0, 1, 2, 3, 4]
}

const batchSize = 2
const result = await all(batch(values(), batchSize))

console.info(result) // [0, 1], [2, 3], [4]
```

# Install

```console
$ npm i it-batch
```

## Browser `<script>` tag

Loading this module through a script tag will make it's exports available as `ItBatch` in the global namespace.

```html
<script src="https://unpkg.com/it-batch/dist/index.min.js"></script>
```

# API Docs

- <https://achingbrain.github.io/it/modules/it_batch.html>

# License

Licensed under either of

- Apache 2.0, ([LICENSE-APACHE](https://github.com/achingbrain/it/blob/main/packages/it-batch/LICENSE-APACHE) / <http://www.apache.org/licenses/LICENSE-2.0>)
- MIT ([LICENSE-MIT](https://github.com/achingbrain/it/blob/main/packages/it-batch/LICENSE-MIT) / <http://opensource.org/licenses/MIT>)

# Contribution

Unless you explicitly state otherwise, any contribution intentionally submitted for inclusion in the work by you, as defined in the Apache-2.0 license, shall be dual licensed as above, without any additional terms or conditions.
