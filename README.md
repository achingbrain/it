# async-iterator-all

[![Build status](https://travis-ci.org/achingbrain/async-iterator-all.svg?branch=master)](https://travis-ci.org/achingbrain/async-iterator-all?branch=master) [![Coverage Status](https://coveralls.io/repos/github/achingbrain/async-iterator-all/badge.svg?branch=master)](https://coveralls.io/github/achingbrain/async-iterator-all?branch=master) [![Dependencies Status](https://david-dm.org/achingbrain/async-iterator-all/status.svg)](https://david-dm.org/achingbrain/async-iterator-all)

> Collects all values from an async iterator and returns them as an array

Mostly useful for tests.

## Install

```sh
$ npm install --save async-iterator-all
```

## Usage

```javascript
const all = require('async-iterator-all')

async function * iterator (values) {
  for (let i = 0; i < values.length; i++) {
    yield values[i]
  }
}

const arr = await all(iterator([0, 1, 2, 3, 4]))

console.info(arr) // 0, 1, 2, 3, 4
```
