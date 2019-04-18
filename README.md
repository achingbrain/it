# async-iterator-to-array

[![Build status](https://travis-ci.org/achingbrain/async-iterator-to-array.svg?branch=master)](https://travis-ci.org/achingbrain/async-iterator-to-array?branch=master) [![Coverage Status](https://coveralls.io/repos/github/achingbrain/async-iterator-to-array/badge.svg?branch=master)](https://coveralls.io/github/achingbrain/async-iterator-to-array?branch=master) [![Dependencies Status](https://david-dm.org/achingbrain/async-iterator-to-array/status.svg)](https://david-dm.org/achingbrain/async-iterator-to-array)

> Collects all values from an async iterator and returns them as an array

Mostly useful for tests.

## Install

```sh
$ npm install --save async-iterator-to-array
```

## Usage

```javascript
const toArray = require('async-iterator-to-array')

async function * iterator (values) {
  for (let i = 0; i < values.length; i++) {
    yield values[i]
  }
}

const arr = await toArray(iterator([0, 1, 2, 3, 4]))

console.info(arr) // 0, 1, 2, 3, 4
```
