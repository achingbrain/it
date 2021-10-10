# it-merge

[![Build status](https://github.com/achingbrain/it/actions/workflows/test.yml/badge.svg?branch=master)](https://github.com/achingbrain/it/actions/workflows/test.yml) [![Coverage Status](https://coveralls.io/repos/github/achingbrain/it/badge.svg?branch=master)](https://coveralls.io/github/achingbrain/it?branch=master) [![Dependencies Status](https://david-dm.org/achingbrain/it/status.svg?path=packages/it-merge)](https://david-dm.org/achingbrain/it?path=packages/it-merge)

> Treat a number of (async) iterables as if they were one

Nb. sources are iterated over in parallel so the order of emitted items is not guaranteed.

## Install

```sh
$ npm install --save it-merge
```

## Usage

```javascript
const all = require('it-merge')

// This can also be an iterator, async iterator, generator, etc
const values1 = [0, 1, 2, 3, 4]
const values2 = [5, 6, 7, 8, 9]

const arr = await all(merge(values1, values2))

console.info(arr) // 0, 1, 5, 6, 2, 3, 4, 7, 8, 9  <- nb. order is not guaranteed
```
