# it-parallel-batch

[![Build status](https://travis-ci.org/achingbrain/it-parallel-batch.svg?branch=master)](https://travis-ci.org/achingbrain/it-parallel-batch?branch=master) [![Coverage Status](https://coveralls.io/repos/github/achingbrain/it-parallel-batch/badge.svg?branch=master)](https://coveralls.io/github/achingbrain/it-parallel-batch?branch=master) [![Dependencies Status](https://david-dm.org/achingbrain/it-parallel-batch/status.svg)](https://david-dm.org/achingbrain/it-parallel-batch)

> Takes an async iterator that emits promise-returning functions, invokes them in parallel and emits the results in the same order as the input

The final batch may be smaller than the max.

## Install

```sh
$ npm install --save it-parallel-batch
```

## Usage

```javascript
const batch = require('it-parallel-batch')
const all = require('it-all')
const delay = require('delay')

async function * iterator (values) {
  yield * values
}

const input = [
  async () => {
    await delay(5000)

    return 1
  },
  async () => {
    await delay(1000)

    return 2
  }
]

const result = await all(parallelBatch(iterator(input), 2))

console.info(result) // [1, 2]
```
