[![codecov](https://img.shields.io/codecov/c/github/achingbrain/it.svg?style=flat-square)](https://codecov.io/gh/achingbrain/it)
[![CI](https://img.shields.io/github/actions/workflow/status/achingbrain/it/js-test-and-release.yml?branch=master\&style=flat-square)](https://github.com/achingbrain/it/actions/workflows/js-test-and-release.yml?query=branch%3Amaster)

> Process (async)iterable values as functions with concurrency control

# About

Takes an async iterator that emits promise-returning functions, invokes them in parallel and emits the results in the same order as the input.

The final batch may be smaller than the batch size.

## Example

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

# Install

```console
$ npm i it-parallel-batch
```

## Browser `<script>` tag

Loading this module through a script tag will make it's exports available as `ItParallelBatch` in the global namespace.

```html
<script src="https://unpkg.com/it-parallel-batch/dist/index.min.js"></script>
```

# License

Licensed under either of

- Apache 2.0, ([LICENSE-APACHE](LICENSE-APACHE) / <http://www.apache.org/licenses/LICENSE-2.0>)
- MIT ([LICENSE-MIT](LICENSE-MIT) / <http://opensource.org/licenses/MIT>)

# Contribution

Unless you explicitly state otherwise, any contribution intentionally submitted for inclusion in the work by you, as defined in the Apache-2.0 license, shall be dual licensed as above, without any additional terms or conditions.
