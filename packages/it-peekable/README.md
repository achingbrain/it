# it-peekable <!-- omit in toc -->

[![codecov](https://img.shields.io/codecov/c/github/achingbrain/it.svg?style=flat-square)](https://codecov.io/gh/achingbrain/it)
[![CI](https://img.shields.io/github/actions/workflow/status/achingbrain/it/js-test-and-release.yml?branch=master\&style=flat-square)](https://github.com/achingbrain/it/actions/workflows/js-test-and-release.yml?query=branch%3Amaster)

> Allows peeking/pushing an iterable

## Table of contents <!-- omit in toc -->

- [Install](#install)
  - [Browser `<script>` tag](#browser-script-tag)
- [Usage](#usage)
- [License](#license)
- [Contribution](#contribution)

## Install

```console
$ npm i it-peekable
```

### Browser `<script>` tag

Loading this module through a script tag will make it's exports available as `ItPeekable` in the global namespace.

```html
<script src="https://unpkg.com/it-peekable/dist/index.min.js"></script>
```

Lets you look at the contents of an async iterator and decide what to do

## Usage

```javascript
import peekable from 'it-peekable'

// This can also be an iterator, generator, etc
const values = [0, 1, 2, 3, 4]

const it = peekable(value)

const first = it.peek()

console.info(first) // 0

it.push(first)

console.info([...it])
// [ 0, 1, 2, 3, 4 ]
```

Async sources must be awaited:

```javascript
import peekable from 'it-peekable'

const values = async function * () {
  yield * [0, 1, 2, 3, 4]
}

const it = peekable(values())

const first = await it.peek()

console.info(first) // 0

it.push(first)

console.info(await all(it))
// [ 0, 1, 2, 3, 4 ]
```

## License

Licensed under either of

- Apache 2.0, ([LICENSE-APACHE](LICENSE-APACHE) / <http://www.apache.org/licenses/LICENSE-2.0>)
- MIT ([LICENSE-MIT](LICENSE-MIT) / <http://opensource.org/licenses/MIT>)

## Contribution

Unless you explicitly state otherwise, any contribution intentionally submitted for inclusion in the work by you, as defined in the Apache-2.0 license, shall be dual licensed as above, without any additional terms or conditions.
