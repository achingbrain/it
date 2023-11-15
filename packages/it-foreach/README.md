[![codecov](https://img.shields.io/codecov/c/github/achingbrain/it.svg?style=flat-square)](https://codecov.io/gh/achingbrain/it)
[![CI](https://img.shields.io/github/actions/workflow/status/achingbrain/it/js-test-and-release.yml?branch=master\&style=flat-square)](https://github.com/achingbrain/it/actions/workflows/js-test-and-release.yml?query=branch%3Amaster)

> Invokes the passed function for each item in an iterable

# About

Calls a function for each value in an (async)iterable.

The function can be sync or async.

Async functions can be awaited on so may slow down processing of the (async)iterable.

## Example

```javascript
import each from 'it-foreach'
import drain from 'it-drain'

// This can also be an iterator, generator, etc
const values = [0, 1, 2, 3, 4]

// prints 0, 1, 2, 3, 4
const arr = drain(
  each(values, console.info)
)
```

Async sources and callbacks must be awaited:

```javascript
import each from 'it-foreach'
import drain from 'it-drain'

const values = async function * () {
  yield * [0, 1, 2, 3, 4]
}

// prints 0, 1, 2, 3, 4
const arr = await drain(
  each(values(), console.info)
)
```

# Install

```console
$ npm i it-foreach
```

## Browser `<script>` tag

Loading this module through a script tag will make it's exports available as `ItForeach` in the global namespace.

```html
<script src="https://unpkg.com/it-foreach/dist/index.min.js"></script>
```

# License

Licensed under either of

- Apache 2.0, ([LICENSE-APACHE](LICENSE-APACHE) / <http://www.apache.org/licenses/LICENSE-2.0>)
- MIT ([LICENSE-MIT](LICENSE-MIT) / <http://opensource.org/licenses/MIT>)

# Contribution

Unless you explicitly state otherwise, any contribution intentionally submitted for inclusion in the work by you, as defined in the Apache-2.0 license, shall be dual licensed as above, without any additional terms or conditions.
