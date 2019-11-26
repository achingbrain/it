# it-glob

> Async iterable filename pattern matcher

Like [`glob`](https://npmjs.com/package/glob) but async iterable.

## Installation

```console
$ npm install --save it-glob
```

## Usage

```javascript
const glob = require('it-glob')

const options = {
  ignore: [
    'glob' // glob patterns to ignore
  ],
  cwd // defaults to process.cwd
  absolute // return absolute paths, defaults to false
  nodir // only yield file paths, skip directories

  // all other options are passed to minimatch
}

for await (const path of glob('/path/to/file', '**/*', options)) {
  console.info(path)
}
```
