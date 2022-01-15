# it-ndjson

[![Build status](https://github.com/achingbrain/it/actions/workflows/test.yml/badge.svg?branch=master)](https://github.com/achingbrain/it/actions/workflows/test.yml) [![Coverage Status](https://coveralls.io/repos/github/achingbrain/it/badge.svg?branch=master)](https://coveralls.io/github/achingbrain/it?branch=master) [![Dependencies Status](https://david-dm.org/achingbrain/it/status.svg?path=packages/it-ndjson)](https://david-dm.org/achingbrain/it?path=packages/it-ndjson)

> Parse iterators as ndjson and transform iterators to ndjson

## Install

```sh
$ npm install --save it-ndjson
```

## Usage

```javascript
const ndjson = require('it-ndjson')
const all = require('it-all')

// This can also be an iterator, async iterator, generator, etc
const values = [0, 1, 2, 3, 4]

const arr = await all(ndjson.stringify(values))

console.info(arr) // '0\n', '1\n', '2\n', '3\n', '4\n'

const res = await all(ndjson.parse(arr))

console.info(res) // [0, 1, 2, 3, 4]
```
