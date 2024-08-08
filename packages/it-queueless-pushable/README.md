# it-queueless-pushable

[![codecov](https://img.shields.io/codecov/c/github/achingbrain/it.svg?style=flat-square)](https://codecov.io/gh/achingbrain/it)
[![CI](https://img.shields.io/github/actions/workflow/status/achingbrain/it/js-test-and-release.yml?branch=main\&style=flat-square)](https://github.com/achingbrain/it/actions/workflows/js-test-and-release.yml?query=branch%3Amain)

> A pushable queue that waits until a value is consumed before accepting another

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

A pushable async generator that waits until the current value is consumed
before allowing a new value to be pushed.

Useful for when you don't want to keep memory usage under control and/or
allow a downstream consumer to dictate how fast data flows through a pipe,
but you want to be able to apply a transform to that data.

## Example

```typescript
import { queuelessPushable } from 'it-queueless-pushable'

const pushable = queuelessPushable<string>()

// run asynchronously
Promise.resolve().then(async () => {
  // push a value - the returned promise will not resolve until the value is
  // read from the pushable
  await pushable.push('hello')
})

// read a value
const result = await pushable.next()
console.info(result) // { done: false, value: 'hello' }
```

# Install

```console
$ npm i it-queueless-pushable
```

## Browser `<script>` tag

Loading this module through a script tag will make its exports available as `ItQueuelessPushable` in the global namespace.

```html
<script src="https://unpkg.com/it-queueless-pushable/dist/index.min.js"></script>
```

# API Docs

- <https://achingbrain.github.io/it/modules/it_queueless_pushable.html>

# License

Licensed under either of

- Apache 2.0, ([LICENSE-APACHE](https://github.com/achingbrain/it/blob/main/packages/it-queueless-pushable/LICENSE-APACHE) / <http://www.apache.org/licenses/LICENSE-2.0>)
- MIT ([LICENSE-MIT](https://github.com/achingbrain/it/blob/main/packages/it-queueless-pushable/LICENSE-MIT) / <http://opensource.org/licenses/MIT>)

# Contribution

Unless you explicitly state otherwise, any contribution intentionally submitted for inclusion in the work by you, as defined in the Apache-2.0 license, shall be dual licensed as above, without any additional terms or conditions.
