# it-to-buffer

[![Build status](https://github.com/achingbrain/it/actions/workflows/test.yml/badge.svg?branch=master)](https://github.com/achingbrain/it/actions/workflows/test.yml) [![Coverage Status](https://coveralls.io/repos/github/achingbrain/it/badge.svg?branch=master)](https://coveralls.io/github/achingbrain/it?branch=master) [![Dependencies Status](https://david-dm.org/achingbrain/it/status.svg?path=packages/it-to-buffer)](https://david-dm.org/achingbrain/it?path=packages/it-to-buffer)

> Takes an iterable that yields buffer-like-objects and concats them into one buffer

## Install

```sh
$ npm install --save it-to-buffer
```

## Usage

```javascript
const toBuffer = require('it-to-buffer')

// This can also be an iterator, async iterator, generator, etc
const values = [Buffer.from([0, 1]), Buffer.from([2, 3])]

const result = await toBuffer(values)

console.info(result) // Buffer[0, 1, 2, 3]
```
