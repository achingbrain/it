# it-sort

[![Build status](https://travis-ci.org/achingbrain/it.svg?branch=master)](https://travis-ci.org/achingbrain/it?branch=master) [![Coverage Status](https://coveralls.io/repos/github/achingbrain/it/badge.svg?branch=master)](https://coveralls.io/github/achingbrain/it?branch=master) [![Dependencies Status](https://david-dm.org/achingbrain/it/status.svg?path=packages/it-sort)](https://david-dm.org/achingbrain/it?path=packages/it-sort)

> Collects all values from an async iterator, sorts them using the passed function and yields them

## Install

```sh
$ npm install --save it-sort
```

## Usage

```javascript
const sort = require('it-sort')
const all = require('it-all')

const sorter = (a, b) => {
  return a.localeCompare(b)
}

// This can also be an iterator, async iterator, generator, etc
const values = ['foo', 'bar']

const arr = await all(sort(values, sorter))

console.info(arr) // 'bar', 'foo'
```
