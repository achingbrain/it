# async-iterator-batch

[![Build status](https://travis-ci.org/achingbrain/async-iterator-batch.svg?branch=master)](https://travis-ci.org/achingbrain/async-iterator-batch?branch=master) [![Coverage Status](https://coveralls.io/repos/github/achingbrain/async-iterator-batch/badge.svg?branch=master)](https://coveralls.io/github/achingbrain/async-iterator-batch?branch=master) [![Dependencies Status](https://david-dm.org/achingbrain/async-iterator-batch/status.svg)](https://david-dm.org/achingbrain/async-iterator-batch)

> Takes an async iterator that emits variable length arrays and emits them as fixed-size batches

The final batch may be smaller than the max.

## Install

```sh
$ npm install --save async-iterator-batch
```

## Usage

```javascript
const batch = require('async-iterator-batch')
const all = require('async-iterator-all')

async function * iterator (values) {
  for (let i = 0; i < values.length; i++) {
    yield values[i]
  }
}

const result = await all(batch(iterator([[0, 1, 2], [3], [4]]), 2))

console.info(result) // [0, 1], [2, 3], [4]
```
