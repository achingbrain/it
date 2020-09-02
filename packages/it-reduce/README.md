# it-reduce

[![Build status](https://travis-ci.org/achingbrain/it.svg?branch=master)](https://travis-ci.org/achingbrain/it?branch=master) [![Coverage Status](https://coveralls.io/repos/github/achingbrain/it/badge.svg?branch=master)](https://coveralls.io/github/achingbrain/it?branch=master) [![Dependencies Status](https://david-dm.org/achingbrain/it/status.svg?path=packages/it-reduce)](https://david-dm.org/achingbrain/it?path=packages/it-reduce)

> Reduces the values yielded by an (async) iterable

Mostly useful for tests or when you want to be explicit about consuming an iterable without doing anything with any yielded values.

## Install

```sh
$ npm install --save it-reduce
```

## Usage

```javascript
const reduce = require('it-reduce')

// This can also be an iterator, async iterator, generator, etc
const values = [0, 1, 2, 3, 4]

const result = await reduce(values, (acc, curr) => acc + curr, 0)

console.info(result) // 10
```
