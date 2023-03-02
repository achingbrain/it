# it-parallel <!-- omit in toc -->

[![codecov](https://img.shields.io/codecov/c/github/achingbrain/it.svg?style=flat-square)](https://codecov.io/gh/achingbrain/it)
[![CI](https://img.shields.io/github/actions/workflow/status/achingbrain/it/js-test-and-release.yml?branch=master\&style=flat-square)](https://github.com/achingbrain/it/actions/workflows/js-test-and-release.yml?query=branch%3Amaster)

> Takes an (async) iterable that emits promise-returning functions, invokes them in parallel up to the concurrency limit and emits the results as they become available, optionally in the same order as the input

## Table of contents <!-- omit in toc -->

- [Install](#install)
  - [Browser `<script>` tag](#browser-script-tag)
- [Usage](#usage)
- [License](#license)
- [Contribution](#contribution)

## Install

```console
$ npm i it-parallel
```

### Browser `<script>` tag

Loading this module through a script tag will make it's exports available as `ItParallel` in the global namespace.

```html
<script src="https://unpkg.com/it-parallel/dist/index.min.js"></script>
```

## Usage

```javascript
import parallel from 'it-parallel'
import all from 'it-all'
import delay from 'delay'

// This can also be an iterator, async iterator, generator, etc
const input = [
  async () => {
    console.info('start 1')
    await delay(500)

    console.info('end 1')
    return 1
  },
  async () => {
    console.info('start 2')
    await delay(200)

    console.info('end 2')
    return 2
  },
  async () => {
    console.info('start 3')
    await delay(100)

    console.info('end 3')
    return 3
  }
]

const result = await all(parallel(input, {
  concurrency: 2
}))

// output:
// start 1
// start 2
// end 2
// start 3
// end 3
// end 1

console.info(result) // [2, 3, 1]
```

If order is important, pass `ordered: true` as an option:

```javascript
const result = await all(parallel(input, {
  concurrency: 2,
  ordered: true
}))

// output:
// start 1
// start 2
// end 2
// start 3
// end 3
// end 1

console.info(result) // [1, 2, 3]
```

## License

Licensed under either of

- Apache 2.0, ([LICENSE-APACHE](LICENSE-APACHE) / <http://www.apache.org/licenses/LICENSE-2.0>)
- MIT ([LICENSE-MIT](LICENSE-MIT) / <http://opensource.org/licenses/MIT>)

## Contribution

Unless you explicitly state otherwise, any contribution intentionally submitted for inclusion in the work by you, as defined in the Apache-2.0 license, shall be dual licensed as above, without any additional terms or conditions.
