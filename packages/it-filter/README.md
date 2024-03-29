[![codecov](https://img.shields.io/codecov/c/github/achingbrain/it.svg?style=flat-square)](https://codecov.io/gh/achingbrain/it)
[![CI](https://img.shields.io/github/actions/workflow/status/achingbrain/it/js-test-and-release.yml?branch=main\&style=flat-square)](https://github.com/achingbrain/it/actions/workflows/js-test-and-release.yml?query=branch%3Amain)

> Filters the passed iterable by using the filter function

# About

Filter values out of an (async)iterable

## Example

```javascript
import all from 'it-all'
import filter from 'it-filter'

// This can also be an iterator, generator, etc
const values = [0, 1, 2, 3, 4]

const fn = val => val > 2 // Return boolean to keep item

const arr = all(filter(values, fn))

console.info(arr) // 3, 4
```

Async sources and filter functions must be awaited:

```javascript
import all from 'it-all'
import filter from 'it-filter'

const values = async function * () {
  yield * [0, 1, 2, 3, 4]
}

const fn = async val => val > 2 // Return boolean or promise of boolean to keep item

const arr = await all(filter(values, fn))

console.info(arr) // 3, 4
```

# Install

```console
$ npm i it-filter
```

## Browser `<script>` tag

Loading this module through a script tag will make it's exports available as `ItFilter` in the global namespace.

```html
<script src="https://unpkg.com/it-filter/dist/index.min.js"></script>
```

# API Docs

- <https://achingbrain.github.io/it/modules/it_filter.html>

# License

Licensed under either of

- Apache 2.0, ([LICENSE-APACHE](LICENSE-APACHE) / <http://www.apache.org/licenses/LICENSE-2.0>)
- MIT ([LICENSE-MIT](LICENSE-MIT) / <http://opensource.org/licenses/MIT>)

# Contribution

Unless you explicitly state otherwise, any contribution intentionally submitted for inclusion in the work by you, as defined in the Apache-2.0 license, shall be dual licensed as above, without any additional terms or conditions.
