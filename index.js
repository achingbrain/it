'use strict'

const fs = require('fs-extra')
const path = require('path')
const minimatch = require('minimatch')

module.exports = async function * glob (dir, pattern, options) {
  const stats = await fs.stat(dir)

  if (stats.isDirectory()) {
    for await (const entry of _glob(dir, pattern, options)) {
      yield entry
    }

    return
  }

  if (minimatch(dir, pattern)) {
    yield dir
  }
}

async function * _glob (dir, pattern, options) {
  for await (const entry of await fs.readdir(dir)) {
    const entryPath = path.join(dir, entry)
    const stats = await fs.stat(entryPath)

    if (stats.isDirectory()) {
      for await (const subEntry of _glob(entryPath, pattern, options)) {
        yield subEntry
      }
    } else {
      if (minimatch(entryPath, pattern)) {
        yield entryPath
      }
    }
  }
}
