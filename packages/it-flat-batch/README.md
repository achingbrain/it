# it-flat-batch

[![Build status](https://github.com/achingbrain/it/actions/workflows/test.yml/badge.svg?branch=master)](https://github.com/achingbrain/it/actions/workflows/test.yml) [![Coverage Status](https://coveralls.io/repos/github/achingbrain/it/badge.svg?branch=master)](https://coveralls.io/github/achingbrain/it?branch=master) [![Dependencies Status](https://david-dm.org/achingbrain/it/status.svg?path=packages/it-flat-batch)](https://david-dm.org/achingbrain/it?path=packages/it-flat-batch)

> Takes an (async) iterable that emits variable length arrays of things and returns an async iterable that emits those thnigs in fixed-size batches.

The final batch may be smaller than requested batch size.

## Install

```sh
$ npm install --save it-flat-batch
```

## Usage

```javascript
const batch = require('it-flat-batch')
const all = require('it-all')

// This can also be an iterator, async iterator, generator, etc
const values = [[0, 1, 2], [3], [4]]
const batchSize = 2

const result = await all(batch(values, batchSize))

console.info(result) // [0, 1], [2, 3], [4]
```
