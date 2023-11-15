[![codecov](https://img.shields.io/codecov/c/github/achingbrain/it.svg?style=flat-square)](https://codecov.io/gh/achingbrain/it)
[![CI](https://img.shields.io/github/actions/workflow/status/achingbrain/it/js-test-and-release.yml?branch=master\&style=flat-square)](https://github.com/achingbrain/it/actions/workflows/js-test-and-release.yml?query=branch%3Amaster)

> Parse iterators as ndjson and transform iterators to ndjson

# About

Turn (async)iterable values into JSON and back again.

## Example

```javascript
import ndjson from 'it-ndjson'
import all from 'it-all'

// This can also be an iterator, async iterator, generator, etc
const values = [0, 1, 2, 3, 4]

const arr = await all(ndjson.stringify(values))

console.info(arr) // '0\n', '1\n', '2\n', '3\n', '4\n'

const res = await all(ndjson.parse(arr))

console.info(res) // [0, 1, 2, 3, 4]
```

# Install

```console
$ npm i it-ndjson
```

## Browser `<script>` tag

Loading this module through a script tag will make it's exports available as `ItNdjson` in the global namespace.

```html
<script src="https://unpkg.com/it-ndjson/dist/index.min.js"></script>
```

# License

Licensed under either of

- Apache 2.0, ([LICENSE-APACHE](LICENSE-APACHE) / <http://www.apache.org/licenses/LICENSE-2.0>)
- MIT ([LICENSE-MIT](LICENSE-MIT) / <http://opensource.org/licenses/MIT>)

# Contribution

Unless you explicitly state otherwise, any contribution intentionally submitted for inclusion in the work by you, as defined in the Apache-2.0 license, shall be dual licensed as above, without any additional terms or conditions.
