'use strict'

const fs = require('fs-extra')
const path = require('path')
const minimatch = require('minimatch')

module.exports = async function * glob (dir, pattern, options = {}) {
  const absoluteDir = path.resolve(dir)
  const relativeDir = path.relative(options.cwd || process.cwd(), dir)

  const stats = await fs.stat(absoluteDir)

  if (stats.isDirectory()) {
    for await (const entry of _glob(absoluteDir, '', pattern, options)) {
      yield entry
    }

    return
  }

  if (minimatch(relativeDir, pattern)) {
    yield options.absolute ? absoluteDir : relativeDir
  }
}

async function * _glob (base, dir, pattern, options) {
  for await (const entry of await fs.readdir(path.join(base, dir))) {
    const relativeEntryPath = path.join(dir, entry)
    const absoluteEntryPath = path.join(base, dir, entry)
    const stats = await fs.stat(absoluteEntryPath)

    if (stats.isDirectory()) {
      yield *  _glob(base, relativeEntryPath, pattern, options)
    } else {
      let match = minimatch(relativeEntryPath, pattern, options)

      if (options.ignore && match && options.ignore.reduce((acc, curr) => {
        return acc || minimatch(relativeEntryPath, curr, options)
      }, false)) {
        match = false
      }

      if (match) {
        yield options.absolute ? absoluteEntryPath : relativeEntryPath
      }
    }
  }
}
