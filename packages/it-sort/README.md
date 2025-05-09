# it-sort

[![codecov](https://img.shields.io/codecov/c/github/achingbrain/it.svg?style=flat-square)](https://codecov.io/gh/achingbrain/it)
[![CI](https://img.shields.io/github/actions/workflow/status/achingbrain/it/js-test-and-release.yml?branch=main\&style=flat-square)](https://github.com/achingbrain/it/actions/workflows/js-test-and-release.yml?query=branch%3Amain)

> Collects all values from an async iterator, sorts them using the passed function and yields them

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

Consumes all values from an (async)iterable and returns them sorted by the passed sort function.

## Example

```javascript
import sort from 'it-sort'
import all from 'it-all'

const sorter = (a, b) => {
  return a.localeCompare(b)
}

// This can also be an iterator, generator, etc
const values = ['foo', 'bar']

const arr = all(sort(values, sorter))

console.info(arr) // 'bar', 'foo'
```

Async sources must be awaited:

```javascript
import sort from 'it-sort'
import all from 'it-all'

const sorter = (a, b) => {
  return a.localeCompare(b)
}

const values = async function * () {
  yield * ['foo', 'bar']
}

const arr = await all(sort(values, sorter))

console.info(arr) // 'bar', 'foo'
```

# Install

```console
$ npm i it-sort
```

## Browser `<script>` tag

Loading this module through a script tag will make its exports available as `ItSort` in the global namespace.

```html
<script src="https://unpkg.com/it-sort/dist/index.min.js"></script>
```

# API Docs

- <https://achingbrain.github.io/it/modules/it_sort.html>

# License

Licensed under either of

- Apache 2.0, ([LICENSE-APACHE](https://github.com/achingbrain/it/blob/main/packages/it-sort/LICENSE-APACHE) / <http://www.apache.org/licenses/LICENSE-2.0>)
- MIT ([LICENSE-MIT](https://github.com/achingbrain/it/blob/main/packages/it-sort/LICENSE-MIT) / <http://opensource.org/licenses/MIT>)

# Contribution

Unless you explicitly state otherwise, any contribution intentionally submitted for inclusion in the work by you, as defined in the Apache-2.0 license, shall be dual licensed as above, without any additional terms or conditions.
