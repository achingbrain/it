# it-length

[![Build status](https://travis-ci.org/achingbrain/it.svg?branch=master)](https://travis-ci.org/achingbrain/it?branch=master) [![Coverage Status](https://coveralls.io/repos/github/achingbrain/it/badge.svg?branch=master)](https://coveralls.io/github/achingbrain/it?branch=master) [![Dependencies Status](https://david-dm.org/achingbrain/it/status.svg?path=packages/it-last)](https://david-dm.org/achingbrain/it?path=packages/it-last)

> Counts the items in an async iterable

N.b. will consume the iterable

## Install

```sh
$ npm install --save it-length
```

## Usage

```javascript
const length = require('it-length')

// This can also be an iterator, async iterator, generator, etc
const values = [0, 1, 2, 3, 4]

const res = await length(values)

console.info(res) // 5
```
