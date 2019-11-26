# it-first

[![Build status](https://travis-ci.org/achingbrain/it-first.svg?branch=master)](https://travis-ci.org/achingbrain/it-first?branch=master) [![Coverage Status](https://coveralls.io/repos/github/achingbrain/it-first/badge.svg?branch=master)](https://coveralls.io/github/achingbrain/it-first?branch=master) [![Dependencies Status](https://david-dm.org/achingbrain/it-first/status.svg)](https://david-dm.org/achingbrain/it-first)

> Returns the first result from an async iterator

Mostly useful for tests.

## Install

```sh
$ npm install --save it-first
```

## Usage

```javascript
const first = require('it-first')

// This can also be an iterator, async iterator, generator, etc
const values = [0, 1, 2, 3, 4]

const res = await first(values)

console.info(res) // 0
```
