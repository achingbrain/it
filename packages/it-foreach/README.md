# it-foreach

[![Build status](https://github.com/achingbrain/it/actions/workflows/test.yml/badge.svg?branch=master)](https://github.com/achingbrain/it/actions/workflows/test.yml) [![Coverage Status](https://coveralls.io/repos/github/achingbrain/it/badge.svg?branch=master)](https://coveralls.io/github/achingbrain/it?branch=master) [![Dependencies Status](https://david-dm.org/achingbrain/it/status.svg?path=packages/it-foreach)](https://david-dm.org/achingbrain/it?path=packages/it-foreach)

> Invokes the passed function for each item in an iterable

For when you need a one-liner to collect iterable values.

## Install

```sh
$ npm install --save it-foreach
```

## Usage

```javascript
const each = require('it-foreach')
const drain = require('it-drain')

// This can also be an iterator, async iterator, generator, etc
const values = [0, 1, 2, 3, 4]

// prints 0, 1, 2, 3, 4
const arr = await drain(
  each(values, console.info)
)
```
