# it-last

[![Build status](https://travis-ci.org/achingbrain/it-last.svg?branch=master)](https://travis-ci.org/achingbrain/it-last?branch=master) [![Coverage Status](https://coveralls.io/repos/github/achingbrain/it-last/badge.svg?branch=master)](https://coveralls.io/github/achingbrain/it-last?branch=master) [![Dependencies Status](https://david-dm.org/achingbrain/it-last/status.svg)](https://david-dm.org/achingbrain/it-last)

> Returns the last result from an async iterator

Mostly useful for tests.

## Install

```sh
$ npm install --save it-last
```

## Usage

```javascript
const last = require('it-last')

async function * iterator (values) {
  yield * values
}

const res = await last(iterator([0, 1, 2, 3, 4]))

console.info(res) // 4
```
