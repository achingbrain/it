# it-to-browser-readablestream

[![Build status](https://travis-ci.org/achingbrain/it.svg?branch=master)](https://travis-ci.org/achingbrain/it?branch=master) [![Coverage Status](https://coveralls.io/repos/github/achingbrain/it/badge.svg?branch=master)](https://coveralls.io/github/achingbrain/it?branch=master) [![Dependencies Status](https://david-dm.org/achingbrain/it/status.svg?path=packages/it-to-browser-readablestream)](https://david-dm.org/achingbrain/it?path=packages/it-to-browser-readablestream)

> Takes an iterable and turns it into a WhatWG browser readablestream

## Install

```sh
$ npm install --save it-to-browser-readablestream
```

## Usage

```javascript
const toBrowserReadableStream = require('it-to-browser-readablestream')

// This can also be an iterator, async iterator, generator, etc
const values = [Buffer.from([0, 1]), Buffer.from([2, 3])]

const stream = await toBrowserReadableStream(values)

for await (const buf of stream) {
  console.info(buf) // Buffer[0, 1]
}
```
