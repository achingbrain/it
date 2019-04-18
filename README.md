# async-iterator-last

[![Build status](https://travis-ci.org/achingbrain/async-iterator-last.svg?branch=master)](https://travis-ci.org/achingbrain/async-iterator-last?branch=master) [![Coverage Status](https://coveralls.io/repos/github/achingbrain/async-iterator-last/badge.svg?branch=master)](https://coveralls.io/github/achingbrain/async-iterator-last?branch=master) [![Dependencies Status](https://david-dm.org/achingbrain/async-iterator-last/status.svg)](https://david-dm.org/achingbrain/async-iterator-last)

> Returns the last result from an async iterator

Mostly useful for tests.

## Install

```sh
$ npm install --save async-iterator-last
```

## Usage

```javascript
const last = require('async-iterator-last')

async function * iterator (values) {
  for (let i = 0; i < values.length; i++) {
    yield values[i]
  }
}

const res = await last(iterator([0, 1, 2, 3, 4]))

console.info(res) // 4
```
