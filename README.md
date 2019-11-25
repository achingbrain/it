# it-flat-batch

[![Build status](https://travis-ci.org/achingbrain/it-flat-batch.svg?branch=master)](https://travis-ci.org/achingbrain/it-flat-batch?branch=master) [![Coverage Status](https://coveralls.io/repos/github/achingbrain/it-flat-batch/badge.svg?branch=master)](https://coveralls.io/github/achingbrain/it-flat-batch?branch=master) [![Dependencies Status](https://david-dm.org/achingbrain/it-flat-batch/status.svg)](https://david-dm.org/achingbrain/it-flat-batch)

> Takes an async iterator that emits variable length arrays and emits them as fixed-size batches

The final batch may be smaller than the max.

## Install

```sh
$ npm install --save it-flat-batch
```

## Usage

```javascript
const batch = require('it-flat-batch')
const all = require('it-all')

async function * iterator (values) {
  yield * values
}

const result = await all(batch(iterator([[0, 1, 2], [3], [4]]), 2))

console.info(result) // [0, 1], [2, 3], [4]
```
