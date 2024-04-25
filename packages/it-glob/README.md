# it-glob

[![codecov](https://img.shields.io/codecov/c/github/achingbrain/it.svg?style=flat-square)](https://codecov.io/gh/achingbrain/it)
[![CI](https://img.shields.io/github/actions/workflow/status/achingbrain/it/js-test-and-release.yml?branch=main\&style=flat-square)](https://github.com/achingbrain/it/actions/workflows/js-test-and-release.yml?query=branch%3Amain)

> Async iterable filename pattern matcher

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

Like [`glob`](https://npmjs.com/package/glob) but async iterable.

File separators on Windows will be yielded as `/` and not \`\`.

## Example

```javascript
import glob from 'it-glob'

// All options are passed through to fast-glob
const options = {}

for await (const path of glob('/path/to/file', '**/*', options)) {
 console.info(path)
}
```

See the [fast-glob docs](https://github.com/mrmlnc/fast-glob#options-3) for the full list of options.

# Install

```console
$ npm i it-glob
```

# API Docs

- <https://achingbrain.github.io/it/modules/it_glob.html>

# License

Licensed under either of

- Apache 2.0, ([LICENSE-APACHE](https://github.com/achingbrain/it/blob/main/packages/it-glob/LICENSE-APACHE) / <http://www.apache.org/licenses/LICENSE-2.0>)
- MIT ([LICENSE-MIT](https://github.com/achingbrain/it/blob/main/packages/it-glob/LICENSE-MIT) / <http://opensource.org/licenses/MIT>)

# Contribution

Unless you explicitly state otherwise, any contribution intentionally submitted for inclusion in the work by you, as defined in the Apache-2.0 license, shall be dual licensed as above, without any additional terms or conditions.
