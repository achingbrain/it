# it-limit-bytes

[![codecov](https://img.shields.io/codecov/c/github/achingbrain/it.svg?style=flat-square)](https://codecov.io/gh/achingbrain/it)
[![CI](https://img.shields.io/github/actions/workflow/status/achingbrain/it/js-test-and-release.yml?branch=main\&style=flat-square)](https://github.com/achingbrain/it/actions/workflows/js-test-and-release.yml?query=branch%3Amain)

> Limit the number of bytes that are yielded from an (async) iterable

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

When passed an (async)iterable that yields objects with a `.byteLength`
property, throw if the cumulative value of that property reaches a limit.

## Example

```javascript
import limitBytes from 'it-limit-bytes'
import drain from 'it-drain'

// This can also be an iterator, generator, etc
const values = [
  Uint8Array.from([0, 1, 2, 3]),
  Uint8Array.from([4, 5, 6, 7])
]

drain(limitBytes(values, 5))
// throws "Read too many bytes - 8/5"
```

Async sources must be awaited:

```javascript
import limitBytes from 'it-limit-bytes'
import drain from 'it-drain'

// This can also be an iterator, generator, etc
const values = [
  Uint8Array.from([0, 1, 2, 3]),
  Uint8Array.from([4, 5, 6, 7])
]

await drain(limitBytes(values, 5))
// throws "Read too many bytes - 8/5"
```

# Install

```console
$ npm i it-map
```

## Browser `<script>` tag

Loading this module through a script tag will make its exports available as `ItMap` in the global namespace.

```html
<script src="https://unpkg.com/it-map/dist/index.min.js"></script>
```

# API Docs

- <https://achingbrain.github.io/it/modules/it_map.html>

# License

Licensed under either of

- Apache 2.0, ([LICENSE-APACHE](https://github.com/achingbrain/it/blob/main/packages/it-map/LICENSE-APACHE) / <http://www.apache.org/licenses/LICENSE-2.0>)
- MIT ([LICENSE-MIT](https://github.com/achingbrain/it/blob/main/packages/it-map/LICENSE-MIT) / <http://opensource.org/licenses/MIT>)

# Contribution

Unless you explicitly state otherwise, any contribution intentionally submitted for inclusion in the work by you, as defined in the Apache-2.0 license, shall be dual licensed as above, without any additional terms or conditions.
