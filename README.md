# it

Utility modules to make dealing with async iterators easier, some trivial, some not.

* [blob-to-it](./packages/blob-to-it) Turn a Blob into an iterable
* [browser-readablestream-to-it](./packages/browser-readablestream-to-it) Turn a browser ReadableStream into an iterable
* [it-all](./packages/it-all) Collect the contents of an iterable into an array
* [it-batch](./packages/it-batch) Batch up the contents of an iterable into arrays
* [it-buffer-stream](./packages/it-buffer-stream) Creates an iterable of buffers
* [it-drain](./packages/it-drain) Consume an iterable and ignore any output
* [it-filter](./packages/it-filter) Skip some items in an iterable based on a filter function
* [it-first](./packages/it-first) Return the first item in an iterable
* [it-flat-batch](./packages/it-flat-batch) Take an iterable of variable length arrays and make them all the same length
* [it-glob](./packages/it-glob) Glob matcher for file systems
* [it-last](./packages/it-last) Return the last item in an iterable
* [it-length](./packages/it-length) Consume an iterable and return its length
* [it-map](./packages/it-map) Map the output of an iterable
* [it-merge](./packages/it-merge) Treat multiple iterables as one
* [it-multipart](./packages/it-multipart) Parse multipart message bodies as an iterable
* [it-parallel-batch](./packages/it-parallel-batch) Take an iterable of functions that return promises and run them in parallel in batches
* [it-peekable](./packages/it-peekable) Peek/push an iterable
* [it-reduce](./packages/it-reduce) Reduce the output of an iterable
* [it-skip](./packages/it-skip) Skip items at the start of an iterable
* [it-split](./packages/it-split) Split an iterable of buffers by linebreaks
* [it-take](./packages/it-take) Limit the number of items you want from an iterable
* [it-to-browser-readablestream](./packages/it-reduce) Turns an iterable into a WhatWG [ReadableStream](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream)
* [it-to-buffer](./packages/it-to-buffer) Takes an iterable of Buffers and concatenates them
