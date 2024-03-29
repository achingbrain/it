[![codecov](https://img.shields.io/codecov/c/github/achingbrain/it.svg?style=flat-square)](https://codecov.io/gh/achingbrain/it)
[![CI](https://img.shields.io/github/actions/workflow/status/achingbrain/it/js-test-and-release.yml?branch=main\&style=flat-square)](https://github.com/achingbrain/it/actions/workflows/js-test-and-release.yml?query=branch%3Amain)

> Reduces the values yielded from an async iterator

# About

Reduce the values of an (async)iterable to a single value.

## Example

```javascript
import reduce from 'it-reduce'

// This can also be an iterator, generator, etc
const values = [0, 1, 2, 3, 4]

const result = reduce(values, (acc, curr) => acc + curr, 0)

console.info(result) // 10
```

Async sources must be awaited:

```javascript
import reduce from 'it-reduce'

const values = async function * () {
  yield * [0, 1, 2, 3, 4]
}

const result = await reduce(values(), (acc, curr) => acc + curr, 0)

console.info(result) // 10
```

# Install

```console
$ npm i it-reduce
```

## Browser `<script>` tag

Loading this module through a script tag will make it's exports available as `ItReduce` in the global namespace.

```html
<script src="https://unpkg.com/it-reduce/dist/index.min.js"></script>
```

# API Docs

- <https://achingbrain.github.io/it/modules/it_reduce.html>

# License

Licensed under either of

- Apache 2.0, ([LICENSE-APACHE](LICENSE-APACHE) / <http://www.apache.org/licenses/LICENSE-2.0>)
- MIT ([LICENSE-MIT](LICENSE-MIT) / <http://opensource.org/licenses/MIT>)

# Contribution

Unless you explicitly state otherwise, any contribution intentionally submitted for inclusion in the work by you, as defined in the Apache-2.0 license, shall be dual licensed as above, without any additional terms or conditions.
