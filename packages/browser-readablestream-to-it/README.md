# browser-readablestream-to-it

[![codecov](https://img.shields.io/codecov/c/github/achingbrain/it.svg?style=flat-square)](https://codecov.io/gh/achingbrain/it)
[![CI](https://img.shields.io/github/actions/workflow/status/achingbrain/it/js-test-and-release.yml?branch=main\&style=flat-square)](https://github.com/achingbrain/it/actions/workflows/js-test-and-release.yml?query=branch%3Amain)

> Turns a browser readble stream into an async iterator

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

Allows treating a browser readable stream as an async iterator.

## Example

```javascript
import toIt from 'browser-readablestream-to-it'
import all from 'it-all'

const content = [0, 1, 2, 3, 4]

const stream = new ReadableStream({
  start(controller) {
    for (let i = 0; i < content.length; i++) {
      controller.enqueue(content[i])
    }

    controller.close()
  }
})

const arr = await all(toIt(stream))

console.info(arr) // 0, 1, 2, 3, 4
```

## preventCancel

By default a readable stream will have [.cancel](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream/cancel) called on it once it has ended or
reading has stopped prematurely.

To prevent this behaviour, pass `preventCancel: true` as an option:

```javascript
const arr = await all(toIt(stream, { preventCancel: true }))

console.info(arr) // 0, 1, 2, 3, 4
```

# Install

```console
$ npm i browser-readablestream-to-it
```

## Browser `<script>` tag

Loading this module through a script tag will make its exports available as `BrowserReadablestreamToIt` in the global namespace.

```html
<script src="https://unpkg.com/browser-readablestream-to-it/dist/index.min.js"></script>
```

# API Docs

- <https://achingbrain.github.io/it/modules/browser_readablestream_to_it.html>

# License

Licensed under either of

- Apache 2.0, ([LICENSE-APACHE](https://github.com/achingbrain/it/blob/main/packages/browser-readablestream-to-it/LICENSE-APACHE) / <http://www.apache.org/licenses/LICENSE-2.0>)
- MIT ([LICENSE-MIT](https://github.com/achingbrain/it/blob/main/packages/browser-readablestream-to-it/LICENSE-MIT) / <http://opensource.org/licenses/MIT>)

# Contribution

Unless you explicitly state otherwise, any contribution intentionally submitted for inclusion in the work by you, as defined in the Apache-2.0 license, shall be dual licensed as above, without any additional terms or conditions.
