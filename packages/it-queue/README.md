# it-queue

[![codecov](https://img.shields.io/codecov/c/github/achingbrain/it.svg?style=flat-square)](https://codecov.io/gh/achingbrain/it)
[![CI](https://img.shields.io/github/actions/workflow/status/achingbrain/it/js-test-and-release.yml?branch=main\&style=flat-square)](https://github.com/achingbrain/it/actions/workflows/js-test-and-release.yml?query=branch%3Amain)

> A queue implementation that can be iterated over

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

Based on `p-queue` but with access to the underlying queue, aborting a task
removes it from the queue and you can iterate over the queue results.

## Example

```ts
import all from 'it-all'
import { Queue } from 'it-queue'

const queue = new Queue({
  concurrency: Infinity
})
void queue.add(async () => {
  return 'hello'
})
void queue.add(async () => {
  return 'world'
})

const results = await all(queue)
// ['hello', 'world']

// how many items are in the queue (includes running items)
console.info(queue.size)

// how many items are running
console.info(queue.running)

// how many items have not started running yet
console.info(queue.queued)
```

# Install

```console
$ npm i it-queue
```

## Browser `<script>` tag

Loading this module through a script tag will make its exports available as `ItQueue` in the global namespace.

```html
<script src="https://unpkg.com/it-queue/dist/index.min.js"></script>
```

# API Docs

- <https://achingbrain.github.io/it/modules/it_queue.html>

# License

Licensed under either of

- Apache 2.0, ([LICENSE-APACHE](https://github.com/achingbrain/it/blob/main/packages/it-queue/LICENSE-APACHE) / <http://www.apache.org/licenses/LICENSE-2.0>)
- MIT ([LICENSE-MIT](https://github.com/achingbrain/it/blob/main/packages/it-queue/LICENSE-MIT) / <http://opensource.org/licenses/MIT>)

# Contribution

Unless you explicitly state otherwise, any contribution intentionally submitted for inclusion in the work by you, as defined in the Apache-2.0 license, shall be dual licensed as above, without any additional terms or conditions.
