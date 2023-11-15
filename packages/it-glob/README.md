[![codecov](https://img.shields.io/codecov/c/github/achingbrain/it.svg?style=flat-square)](https://codecov.io/gh/achingbrain/it)
[![CI](https://img.shields.io/github/actions/workflow/status/achingbrain/it/js-test-and-release.yml?branch=master\&style=flat-square)](https://github.com/achingbrain/it/actions/workflows/js-test-and-release.yml?query=branch%3Amaster)

> Async iterable filename pattern matcher

# About

Like [`glob`](https://npmjs.com/package/glob) but async iterable.

## Example

```javascript
import glob from 'it-glob'

const options = {
  cwd // defaults to process.cwd
  absolute // return absolute paths, defaults to false
  nodir // only yield file paths, skip directories

  // all other options are passed to minimatch
}

for await (const path of glob('/path/to/file', '**/*', options)) {
 console.info(path)
}
```

See the [minimatch docs](https://www.npmjs.com/package/minimatch#options) for the full list of options.

# Install

```console
$ npm i it-glob
```

# License

Licensed under either of

- Apache 2.0, ([LICENSE-APACHE](LICENSE-APACHE) / <http://www.apache.org/licenses/LICENSE-2.0>)
- MIT ([LICENSE-MIT](LICENSE-MIT) / <http://opensource.org/licenses/MIT>)

# Contribution

Unless you explicitly state otherwise, any contribution intentionally submitted for inclusion in the work by you, as defined in the Apache-2.0 license, shall be dual licensed as above, without any additional terms or conditions.
