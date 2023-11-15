[![codecov](https://img.shields.io/codecov/c/github/achingbrain/it.svg?style=flat-square)](https://codecov.io/gh/achingbrain/it)
[![CI](https://img.shields.io/github/actions/workflow/status/achingbrain/it/js-test-and-release.yml?branch=master\&style=flat-square)](https://github.com/achingbrain/it/actions/workflows/js-test-and-release.yml?query=branch%3Amaster)

> Takes an async iterator and turns it into a browser readable stream

# About

Turns an (async)iterable into a W3C ReadbleStream.

## Example

```javascript
import toBrowserReadableStream from 'it-to-browser-readablestream'

// This can also be an iterator, async iterator, generator, etc
const values = [Buffer.from([0, 1]), Buffer.from([2, 3])]

const stream = await toBrowserReadableStream(values)

for await (const buf of stream) {
  console.info(buf) // Buffer[0, 1]
}
```

# Install

```console
$ npm i it-to-browser-readablestream
```

## Browser `<script>` tag

Loading this module through a script tag will make it's exports available as `ItToBrowserReadablestream` in the global namespace.

```html
<script src="https://unpkg.com/it-to-browser-readablestream/dist/index.min.js"></script>
```

# License

Licensed under either of

- Apache 2.0, ([LICENSE-APACHE](LICENSE-APACHE) / <http://www.apache.org/licenses/LICENSE-2.0>)
- MIT ([LICENSE-MIT](LICENSE-MIT) / <http://opensource.org/licenses/MIT>)

# Contribution

Unless you explicitly state otherwise, any contribution intentionally submitted for inclusion in the work by you, as defined in the Apache-2.0 license, shall be dual licensed as above, without any additional terms or conditions.
