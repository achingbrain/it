# it-split

[![Build status](https://travis-ci.org/achingbrain/it.svg?branch=master)](https://travis-ci.org/achingbrain/it?branch=master) [![Coverage Status](https://coveralls.io/repos/github/achingbrain/it/badge.svg?branch=master)](https://coveralls.io/github/achingbrain/it?branch=master) [![Dependencies Status](https://david-dm.org/achingbrain/it/status.svg?path=packages/it-split)](https://david-dm.org/achingbrain/it?path=packages/it-split)

> Splits Uint8Arrays emitted by an (async) iterable by a delimiter

## Install

```sh
$ npm install --save it-split
```

## Usage

```javascript
const split = require('it-split')
const encoder = new TextEncoder()

// This can also be an iterator, async iterator, generator, etc
const values = [
  encoder.encode('hello\nwor'),
  encoder.encode('ld')
]

const arr = await all(split(values))

console.info(arr) // [encoder.encode('hello'), encoder.encode('world')]
```

You can also split by arbitrary delimiters:

```javascript
const values = [
  Uint8Array.from([0, 1, 2, 3]),
  Uint8Array.from([0, 1, 2, 3]),
  Uint8Array.from([1, 1, 2])
]
const delimiter = Uint8Array.from([1, 2])

const arr = await all(split(values, {
  delimiter
}))

console.info(arr) // [ Buffer.from([0]), Buffer.from([3, 0]), Buffer.from([3, 1]) ]
```
