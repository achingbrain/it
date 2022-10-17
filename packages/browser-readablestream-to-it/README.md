# browser-readablestream-to-it <!-- omit in toc -->

[![codecov](https://img.shields.io/codecov/c/github/achingbrain/it.svg?style=flat-square)](https://codecov.io/gh/achingbrain/it)
[![CI](https://img.shields.io/github/workflow/status/achingbrain/it/test%20&%20maybe%20release/master?style=flat-square)](https://github.com/achingbrain/it/actions/workflows/js-test-and-release.yml)

> Turns a browser readble stream into an async iterator

## Table of contents <!-- omit in toc -->

- [Install](#install)
- [Usage](#usage)
  - [preventCancel](#preventcancel)
- [License](#license)
- [Contribute](#contribute)

## Install

```console
$ npm i browser-readablestream-to-it
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

## Contribute

Unless you explicitly state otherwise, any contribution intentionally submitted for inclusion in the work by you, as defined in the Apache-2.0 license, shall be dual licensed as above, without any additional terms or conditions.
