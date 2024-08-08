# it-foreach

[![codecov](https://img.shields.io/codecov/c/github/achingbrain/it.svg?style=flat-square)](https://codecov.io/gh/achingbrain/it)
[![CI](https://img.shields.io/github/actions/workflow/status/achingbrain/it/js-test-and-release.yml?branch=main\&style=flat-square)](https://github.com/achingbrain/it/actions/workflows/js-test-and-release.yml?query=branch%3Amain)

> Invokes the passed function for each item in an iterable

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

Calls a function for each value in an (async)iterable.

The function can be sync or async.

Async functions can be awaited on so may slow down processing of the (async)iterable.

## Example

```javascript
import each from 'it-foreach'
import drain from 'it-drain'

// This can also be an iterator, generator, etc
const values = [0, 1, 2, 3, 4]

// prints [0, 0], [1, 1], [2, 2], [3, 3], [4, 4]
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

// prints [0, 0], [1, 1], [2, 2], [3, 3], [4, 4]
const arr = await drain(
  each(values(), console.info)
)
```

# Install

```console
$ npm i it-foreach
```

## Browser `<script>` tag

Loading this module through a script tag will make its exports available as `ItForeach` in the global namespace.

```html
<script src="https://unpkg.com/it-foreach/dist/index.min.js"></script>
```

# API Docs

- <https://achingbrain.github.io/it/modules/it_foreach.html>

# License

Licensed under either of

- Apache 2.0, ([LICENSE-APACHE](https://github.com/achingbrain/it/blob/main/packages/it-foreach/LICENSE-APACHE) / <http://www.apache.org/licenses/LICENSE-2.0>)
- MIT ([LICENSE-MIT](https://github.com/achingbrain/it/blob/main/packages/it-foreach/LICENSE-MIT) / <http://opensource.org/licenses/MIT>)

# Contribution

Unless you explicitly state otherwise, any contribution intentionally submitted for inclusion in the work by you, as defined in the Apache-2.0 license, shall be dual licensed as above, without any additional terms or conditions.
