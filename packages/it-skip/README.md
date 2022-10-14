# it-skip

[![Build status](https://github.com/achingbrain/it/actions/workflows/test.yml/badge.svg?branch=master)](https://github.com/achingbrain/it/actions/workflows/test.yml) [![Coverage Status](https://coveralls.io/repos/github/achingbrain/it/badge.svg?branch=master)](https://coveralls.io/github/achingbrain/it?branch=master) [![Dependencies Status](https://david-dm.org/achingbrain/it/status.svg?path=packages/it-skip)](https://david-dm.org/achingbrain/it?path=packages/it-skip)

> Skip items from an iterable.

For when you are only interested in later values from an iterable.

## Install

```sh
$ npm install --save it-skip
```

## Usage

```javascript
const take = require('it-skip')
import all from 'it-all'

// This can also be an iterator, async iterator, generator, etc
const values = [0, 1, 2, 3, 4]

const arr = await all(skip(values, 2))

console.info(arr) // 2, 3, 4
```
