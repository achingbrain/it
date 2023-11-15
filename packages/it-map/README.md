[![codecov](https://img.shields.io/codecov/c/github/achingbrain/it.svg?style=flat-square)](https://codecov.io/gh/achingbrain/it)
[![CI](https://img.shields.io/github/actions/workflow/status/achingbrain/it/js-test-and-release.yml?branch=master\&style=flat-square)](https://github.com/achingbrain/it/actions/workflows/js-test-and-release.yml?query=branch%3Amaster)

> Maps the values yielded by an async iterator

# About

Convert one value from an (async)iterator into another.

## Example

```javascript
import map from 'it-map'

// This can also be an iterator, generator, etc
const values = [0, 1, 2, 3, 4]

const result = map(values, (val) => val++)

console.info(result) // [1, 2, 3, 4, 5]
```

Async sources and transforms must be awaited:

```javascript
import map from 'it-map'

const values = async function * () {
  yield * [0, 1, 2, 3, 4]
}

const result = await map(values(), async (val) => val++)

console.info(result) // [1, 2, 3, 4, 5]
```

# Install

```console
$ npm i it-map
```

## Browser `<script>` tag

Loading this module through a script tag will make it's exports available as `ItMap` in the global namespace.

```html
<script src="https://unpkg.com/it-map/dist/index.min.js"></script>
```

# License

Licensed under either of

- Apache 2.0, ([LICENSE-APACHE](LICENSE-APACHE) / <http://www.apache.org/licenses/LICENSE-2.0>)
- MIT ([LICENSE-MIT](LICENSE-MIT) / <http://opensource.org/licenses/MIT>)

# Contribution

Unless you explicitly state otherwise, any contribution intentionally submitted for inclusion in the work by you, as defined in the Apache-2.0 license, shall be dual licensed as above, without any additional terms or conditions.
