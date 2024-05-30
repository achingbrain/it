# it

[![codecov](https://img.shields.io/codecov/c/github/achingbrain/it.svg?style=flat-square)](https://codecov.io/gh/achingbrain/it)
[![CI](https://img.shields.io/github/actions/workflow/status/achingbrain/it/js-test-and-release.yml?branch=main\&style=flat-square)](https://github.com/achingbrain/it/actions/workflows/js-test-and-release.yml?query=branch%3Amain)

> A collection of utilities for making working with iterables more bearable

# Packages

- [`packages/blob-to-it`](https://github.com/achingbrain/it/tree/main/packages/blob-to-it) Turns a blob into an async iterator
- [`packages/browser-readablestream-to-it`](https://github.com/achingbrain/it/tree/main/packages/browser-readablestream-to-it) Turns a browser readble stream into an async iterator
- [`packages/it-all`](https://github.com/achingbrain/it/tree/main/packages/it-all) Collects all values from an (async) iterable and returns them as an array
- [`packages/it-batch`](https://github.com/achingbrain/it/tree/main/packages/it-batch) Takes an async iterator that emits things and emits them as fixed size batches
- [`packages/it-batched-bytes`](https://github.com/achingbrain/it/tree/main/packages/it-batched-bytes) Takes an async iterator that emits byte arrays and emits them as fixed size batches
- [`packages/it-buffer-stream`](https://github.com/achingbrain/it/tree/main/packages/it-buffer-stream) An async iterator that emits buffers containing bytes up to a certain length
- [`packages/it-byte-stream`](https://github.com/achingbrain/it/tree/main/packages/it-byte-stream) Read and write arbitrary bytes over a duplex stream
- [`packages/it-drain`](https://github.com/achingbrain/it/tree/main/packages/it-drain) Empties an async iterator
- [`packages/it-filter`](https://github.com/achingbrain/it/tree/main/packages/it-filter) Filters the passed iterable by using the filter function
- [`packages/it-first`](https://github.com/achingbrain/it/tree/main/packages/it-first) Returns the first result from an async iterator
- [`packages/it-flat-batch`](https://github.com/achingbrain/it/tree/main/packages/it-flat-batch) Takes an async iterator that emits variable length arrays and emits them as fixed size batches
- [`packages/it-foreach`](https://github.com/achingbrain/it/tree/main/packages/it-foreach) Invokes the passed function for each item in an iterable
- [`packages/it-glob`](https://github.com/achingbrain/it/tree/main/packages/it-glob) Async iterable filename pattern matcher
- [`packages/it-last`](https://github.com/achingbrain/it/tree/main/packages/it-last) Returns the last result from an async iterator
- [`packages/it-length`](https://github.com/achingbrain/it/tree/main/packages/it-length) Counts the number of items in an async iterable
- [`packages/it-length-prefixed-stream`](https://github.com/achingbrain/it/tree/main/packages/it-length-prefixed-stream) Read and write length-prefixed byte arrays over a duplex stream
- [`packages/it-map`](https://github.com/achingbrain/it/tree/main/packages/it-map) Maps the values yielded by an async iterator
- [`packages/it-merge`](https://github.com/achingbrain/it/tree/main/packages/it-merge) Treat one or more iterables as a single iterable
- [`packages/it-multipart`](https://github.com/achingbrain/it/tree/main/packages/it-multipart) Async iterable http multipart message parser
- [`packages/it-ndjson`](https://github.com/achingbrain/it/tree/main/packages/it-ndjson) Parse iterators as ndjson and transform iterators to ndjson
- [`packages/it-parallel`](https://github.com/achingbrain/it/tree/main/packages/it-parallel) Process incoming async(iterable) functions in parallel
- [`packages/it-parallel-batch`](https://github.com/achingbrain/it/tree/main/packages/it-parallel-batch) Process (async)iterable values as functions with concurrency control
- [`packages/it-peekable`](https://github.com/achingbrain/it/tree/main/packages/it-peekable) Allows peeking/pushing an iterable
- [`packages/it-protobuf-stream`](https://github.com/achingbrain/it/tree/main/packages/it-protobuf-stream) Read and write protobuf messages over a duplex stream
- [`packages/it-queueless-pushable`](https://github.com/achingbrain/it/tree/main/packages/it-queueless-pushable) A pushable queue that waits until a value is consumed before accepting another
- [`packages/it-reduce`](https://github.com/achingbrain/it/tree/main/packages/it-reduce) Reduces the values yielded from an async iterator
- [`packages/it-rpc`](https://github.com/achingbrain/it/tree/main/packages/it-rpc) Schema-free RPC over async iterables
- [`packages/it-skip`](https://github.com/achingbrain/it/tree/main/packages/it-skip) Skip items from an iterable
- [`packages/it-sort`](https://github.com/achingbrain/it/tree/main/packages/it-sort) Collects all values from an async iterator, sorts them using the passed function and yields them
- [`packages/it-split`](https://github.com/achingbrain/it/tree/main/packages/it-split) Splits Uint8Arrays emitted by an (async) iterable by a delimiter
- [`packages/it-take`](https://github.com/achingbrain/it/tree/main/packages/it-take) Stop iteration after n items have been received
- [`packages/it-to-browser-readablestream`](https://github.com/achingbrain/it/tree/main/packages/it-to-browser-readablestream) Takes an async iterator and turns it into a browser readable stream
- [`packages/it-to-buffer`](https://github.com/achingbrain/it/tree/main/packages/it-to-buffer) Takes an async iterator that yields buffers and concatenates them all together

# API Docs

- <https://achingbrain.github.io/it>

# License

Licensed under either of

- Apache 2.0, ([LICENSE-APACHE](https://github.com/achingbrain/it/blob/main/LICENSE-APACHE) / <http://www.apache.org/licenses/LICENSE-2.0>)
- MIT ([LICENSE-MIT](https://github.com/achingbrain/it/blob/main/LICENSE-MIT) / <http://opensource.org/licenses/MIT>)

# Contribution

Unless you explicitly state otherwise, any contribution intentionally submitted for inclusion in the work by you, as defined in the Apache-2.0 license, shall be dual licensed as above, without any additional terms or conditions.
