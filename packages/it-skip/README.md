# it-skip

[![Build status](https://travis-ci.org/achingbrain/it.svg?branch=master)](https://travis-ci.org/achingbrain/it?branch=master) [![Coverage Status](https://coveralls.io/repos/github/achingbrain/it/badge.svg?branch=master)](https://coveralls.io/github/achingbrain/it?branch=master) [![Dependencies Status](https://david-dm.org/achingbrain/it/status.svg?path=packages/it-skip)](https://david-dm.org/achingbrain/it?path=packages/it-skip)

> Skip items from an iterable.

For when you are only interested in later values from an iterable.

## Install

```sh
$ npm install --save it-skip
```

## Usage

```javascript
const take = require('it-skip')
const all = require('it-all')

// This can also be an iterator, async iterator, generator, etc
const values = [0, 1, 2, 3, 4]

const arr = await all(skip(values, 2))

console.info(arr) // 2, 3, 4
```
