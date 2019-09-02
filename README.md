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
  ]
  // all other options are passed to minimatch
}

for await (const path of glob('/path/to/file', '**/*', options)) {
  console.info(path)
}
```
