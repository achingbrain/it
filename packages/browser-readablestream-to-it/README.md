# browser-readablestream-to-it <!-- omit in toc -->

[![codecov](https://img.shields.io/codecov/c/github/achingbrain/it.svg?style=flat-square)](https://codecov.io/gh/achingbrain/it)
[![CI](https://img.shields.io/github/actions/workflow/status/achingbrain/it/js-test-and-release.yml?branch=master\&style=flat-square)](https://github.com/achingbrain/it/actions/workflows/js-test-and-release.yml?query=branch%3Amaster)

> Turns a browser readble stream into an async iterator

## Table of contents <!-- omit in toc -->

- [Install](#install)
  - [Browser `<script>` tag](#browser-script-tag)
- [Usage](#usage)
  - [preventCancel](#preventcancel)
- [License](#license)
- [Contribution](#contribution)

## Install

```console
$ npm i browser-readablestream-to-it
```

### Browser `<script>` tag

Loading this module through a script tag will make it's exports available as `BrowserReadablestreamToIt` in the global namespace.

```html
<script src="https://unpkg.com/browser-readablestream-to-it/dist/index.min.js"></script>
```

## Usage

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

### preventCancel

By default a readable stream will have [.cancel](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream/cancel) called on it once it has ended or
reading has stopped prematurely.

To prevent this behaviour, pass `preventCancel: true` as an option:

```javascript
const arr = await all(toIt(stream, { preventCancel: true }))

console.info(arr) // 0, 1, 2, 3, 4
```

## License

Licensed under either of

- Apache 2.0, ([LICENSE-APACHE](LICENSE-APACHE) / <http://www.apache.org/licenses/LICENSE-2.0>)
- MIT ([LICENSE-MIT](LICENSE-MIT) / <http://opensource.org/licenses/MIT>)

## Contribution

Unless you explicitly state otherwise, any contribution intentionally submitted for inclusion in the work by you, as defined in the Apache-2.0 license, shall be dual licensed as above, without any additional terms or conditions.
