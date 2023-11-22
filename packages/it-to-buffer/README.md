[![codecov](https://img.shields.io/codecov/c/github/achingbrain/it.svg?style=flat-square)](https://codecov.io/gh/achingbrain/it)
[![CI](https://img.shields.io/github/actions/workflow/status/achingbrain/it/js-test-and-release.yml?branch=main\&style=flat-square)](https://github.com/achingbrain/it/actions/workflows/js-test-and-release.yml?query=branch%3Amain)

> Takes an async iterator that yields buffers and concatenates them all together

# About

Collects all `Uint8Array` values from an (async)iterable and returns them as a single `Uint8Array`.

## Example

```javascript
import toBuffer from 'it-to-buffer'

// This can also be an iterator, generator, etc
const values = [Buffer.from([0, 1]), Buffer.from([2, 3])]

const result = toBuffer(values)

console.info(result) // Buffer[0, 1, 2, 3]
```

Async sources must be awaited:

```javascript
import toBuffer from 'it-to-buffer'

const values = async function * () {
  yield Buffer.from([0, 1])
  yield Buffer.from([2, 3])
}

const result = await toBuffer(values())

console.info(result) // Buffer[0, 1, 2, 3]
```

# Install

```console
$ npm i it-to-buffer
```

## Browser `<script>` tag

Loading this module through a script tag will make it's exports available as `ItToBuffer` in the global namespace.

```html
<script src="https://unpkg.com/it-to-buffer/dist/index.min.js"></script>
```

# API Docs

- <https://achingbrain.github.io/it/modules/it_to_buffer.html>

# License

Licensed under either of

- Apache 2.0, ([LICENSE-APACHE](LICENSE-APACHE) / <http://www.apache.org/licenses/LICENSE-2.0>)
- MIT ([LICENSE-MIT](LICENSE-MIT) / <http://opensource.org/licenses/MIT>)

# Contribution

Unless you explicitly state otherwise, any contribution intentionally submitted for inclusion in the work by you, as defined in the Apache-2.0 license, shall be dual licensed as above, without any additional terms or conditions.
