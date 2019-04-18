# async-iterator-first

[![Build status](https://travis-ci.org/achingbrain/async-iterator-first.svg?branch=master)](https://travis-ci.org/achingbrain/async-iterator-first?branch=master) [![Coverage Status](https://coveralls.io/repos/github/achingbrain/async-iterator-first/badge.svg?branch=master)](https://coveralls.io/github/achingbrain/async-iterator-first?branch=master) [![Dependencies Status](https://david-dm.org/achingbrain/async-iterator-first/status.svg)](https://david-dm.org/achingbrain/async-iterator-first)

> Returns the first result from an async iterator

Mostly useful for tests.

## Install

```sh
$ npm install --save async-iterator-first
```

## Usage

```javascript
const first = require('async-iterator-first')

async function * iterator (values) {
  for (let i = 0; i < values.length; i++) {
    yield values[i]
  }
}

const res = await first(iterator([0, 1, 2, 3, 4]))

console.info(res) // 0
```
