[![codecov](https://img.shields.io/codecov/c/github/achingbrain/it.svg?style=flat-square)](https://codecov.io/gh/achingbrain/it)
[![CI](https://img.shields.io/github/actions/workflow/status/achingbrain/it/js-test-and-release.yml?branch=master\&style=flat-square)](https://github.com/achingbrain/it/actions/workflows/js-test-and-release.yml?query=branch%3Amaster)

> Empties an async iterator

# About

Mostly useful for tests or when you want to be explicit about consuming an iterable without doing anything with any yielded values.

## Example

```javascript
import drain from 'it-drain'

// This can also be an iterator, generator, etc
const values = [0, 1, 2, 3, 4]

drain(values)
```

Async sources must be awaited:

```javascript
import drain from 'it-drain'

const values = async function * {
  yield * [0, 1, 2, 3, 4]
}

await drain(values())
```

# Install

```console
$ npm i it-drain
```

## Browser `<script>` tag

Loading this module through a script tag will make it's exports available as `ItDrain` in the global namespace.

```html
<script src="https://unpkg.com/it-drain/dist/index.min.js"></script>
```

# License

Licensed under either of

- Apache 2.0, ([LICENSE-APACHE](LICENSE-APACHE) / <http://www.apache.org/licenses/LICENSE-2.0>)
- MIT ([LICENSE-MIT](LICENSE-MIT) / <http://opensource.org/licenses/MIT>)

# Contribution

Unless you explicitly state otherwise, any contribution intentionally submitted for inclusion in the work by you, as defined in the Apache-2.0 license, shall be dual licensed as above, without any additional terms or conditions.
