# it-last

[![Build status](https://travis-ci.org/achingbrain/it.svg?branch=master)](https://travis-ci.org/achingbrain/it?branch=master) [![Coverage Status](https://coveralls.io/repos/github/achingbrain/it/badge.svg?branch=master)](https://coveralls.io/github/achingbrain/it?branch=master) [![Dependencies Status](https://david-dm.org/achingbrain/it/status.svg?path=packages/it-last)](https://david-dm.org/achingbrain/it?path=packages/it-last)

> Returns the last item of an (async) iterable

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
