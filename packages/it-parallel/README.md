# it-parallel

[![Build status](https://travis-ci.org/achingbrain/it.svg?branch=master)](https://travis-ci.org/achingbrain/it?branch=master) [![Coverage Status](https://coveralls.io/repos/github/achingbrain/it/badge.svg?branch=master)](https://coveralls.io/github/achingbrain/it?branch=master) [![Dependencies Status](https://david-dm.org/achingbrain/it/status.svg?path=packages/it-parallel-batch)](https://david-dm.org/achingbrain/it?path=packages/it-parallel-batch)

> Takes an (async) iterable that emits promise-returning functions, invokes them in parallel up to the concurrency limit and emits the results as they become available but in the same order as the input

## Install

```sh
$ npm install --save it-parallel
```

## Usage

```javascript
const parallel = require('it-parallel')
const all = require('it-all')
const delay = require('delay')

// This can also be an iterator, async iterator, generator, etc
const input = [
  async () => {
    console.info('start 1')
    await delay(500)

    console.info('end 1')
    return 1
  },
  async () => {
    console.info('start 2')
    await delay(200)

    console.info('end 2')
    return 2
  },
  async () => {
    console.info('start 3')
    await delay(100)

    console.info('end 3')
    return 3
  }
]

const batchSize = 2

const result = await all(parallel(input, batchSize))

// output:
// start 1
// start 2
// end 2
// start 3
// end 3
// end 1

console.info(result) // [1, 2, 3]
```
