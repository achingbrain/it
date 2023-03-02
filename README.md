# it <!-- omit in toc -->

[![codecov](https://img.shields.io/codecov/c/github/achingbrain/it.svg?style=flat-square)](https://codecov.io/gh/achingbrain/it)
[![CI](https://img.shields.io/github/actions/workflow/status/achingbrain/it/js-test-and-release.yml?branch=master\&style=flat-square)](https://github.com/achingbrain/it/actions/workflows/js-test-and-release.yml?query=branch%3Amaster)

> A collection of utilities for making working with iterables more bearable

## Table of contents <!-- omit in toc -->

- [Structure](#structure)
- [License](#license)
- [Contribution](#contribution)

## Structure

- [`/packages/blob-to-it`](./packages/blob-to-it) Turns a blob into an async iterator
- [`/packages/browser-readablestream-to-it`](./packages/browser-readablestream-to-it) Turns a browser readble stream into an async iterator
- [`/packages/it-all`](./packages/it-all) Collects all values from an (async) iterable and returns them as an array
- [`/packages/it-batch`](./packages/it-batch) Takes an async iterator that emits things and emits them as fixed size batches
- [`/packages/it-batched-bytes`](./packages/it-batched-bytes) Takes an async iterator that emits byte arrays and emits them as fixed size batches
- [`/packages/it-buffer-stream`](./packages/it-buffer-stream) An async iterator that emits buffers containing bytes up to a certain length
- [`/packages/it-drain`](./packages/it-drain) Empties an async iterator
- [`/packages/it-filter`](./packages/it-filter) Filters the passed iterable by using the filter function
- [`/packages/it-first`](./packages/it-first) Returns the first result from an async iterator
- [`/packages/it-flat-batch`](./packages/it-flat-batch) Takes an async iterator that emits variable length arrays and emits them as fixed size batches
- [`/packages/it-foreach`](./packages/it-foreach) Invokes the passed function for each item in an iterable
- [`/packages/it-glob`](./packages/it-glob) Async iterable filename pattern matcher
- [`/packages/it-last`](./packages/it-last) Returns the last result from an async iterator
- [`/packages/it-length`](./packages/it-length) Counts the number of items in an async iterable
- [`/packages/it-map`](./packages/it-map) Maps the values yielded by an async iterator
- [`/packages/it-merge`](./packages/it-merge) Treat one or more iterables as a single iterable
- [`/packages/it-multipart`](./packages/it-multipart) Async iterable http multipart message parser
- [`/packages/it-ndjson`](./packages/it-ndjson) Parse iterators as ndjson and transform iterators to ndjson
- [`/packages/it-parallel`](./packages/it-parallel) Takes an (async) iterable that emits promise-returning functions, invokes them in parallel up to the concurrency limit and emits the results as they become available, optionally in the same order as the input
- [`/packages/it-parallel-batch`](./packages/it-parallel-batch) Takes an async iterator that emits promise-returning functions, invokes them in parallel and emits the results in the same order as the input
- [`/packages/it-peekable`](./packages/it-peekable) Allows peeking/pushing an iterable
- [`/packages/it-reduce`](./packages/it-reduce) Reduces the values yielded from an async iterator
- [`/packages/it-skip`](./packages/it-skip) Skip items from an iterable
- [`/packages/it-sort`](./packages/it-sort) Collects all values from an async iterator, sorts them using the passed function and yields them
- [`/packages/it-split`](./packages/it-split) Splits Uint8Arrays emitted by an (async) iterable by a delimiter
- [`/packages/it-take`](./packages/it-take) Stop iteration after n items have been received
- [`/packages/it-to-browser-readablestream`](./packages/it-to-browser-readablestream) Takes an async iterator and turns it into a browser readable stream
- [`/packages/it-to-buffer`](./packages/it-to-buffer) Takes an async iterator that yields buffers and concatenates them all together

## License

Licensed under either of

- Apache 2.0, ([LICENSE-APACHE](LICENSE-APACHE) / <http://www.apache.org/licenses/LICENSE-2.0>)
- MIT ([LICENSE-MIT](LICENSE-MIT) / <http://opensource.org/licenses/MIT>)

## Contribution

Unless you explicitly state otherwise, any contribution intentionally submitted for inclusion in the work by you, as defined in the Apache-2.0 license, shall be dual licensed as above, without any additional terms or conditions.
