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

// This can also be an iterator, async iterator, generator, etc
const values = [0, 1, 2, 3, 4]

const res = await last(values)

console.info(res) // 4
```
