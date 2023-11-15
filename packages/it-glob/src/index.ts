/**
 * @packageDocumentation
 *
 * Like [`glob`](https://npmjs.com/package/glob) but async iterable.
 *
 * @example
 *
 * ```javascript
 * import glob from 'it-glob'
 *
 * const options = {
 *   cwd // defaults to process.cwd
 *   absolute // return absolute paths, defaults to false
 *   nodir // only yield file paths, skip directories
 *
 *   // all other options are passed to minimatch
 * }
 *
 * for await (const path of glob('/path/to/file', '**\/*', options)) {
 *  console.info(path)
 * }
 * ```
 *
 * See the [minimatch docs](https://www.npmjs.com/package/minimatch#options) for the full list of options.
 */

import fs from 'fs/promises'
import path from 'path'
import { minimatch } from 'minimatch'
import type { MinimatchOptions } from 'minimatch'

export interface GlobOptions extends MinimatchOptions {
  /**
   * The current working directory
   */
  cwd?: string

  /**
   * If true produces absolute paths (default: false)
   */
  absolute?: boolean

  /**
   * If true yields file paths and skip directories (default: false)
   */
  nodir?: boolean
}

/**
 * Async iterable filename pattern matcher
 */
export default async function * glob (dir: string, pattern: string, options: GlobOptions = {}): AsyncGenerator<string, void, undefined> {
  const absoluteDir = path.resolve(dir)
  const relativeDir = path.relative(options.cwd ?? process.cwd(), dir)

  const stats = await fs.stat(absoluteDir)

  if (stats.isDirectory()) {
    for await (const entry of _glob(absoluteDir, '', pattern, options)) {
      yield entry
    }

    return
  }

  if (minimatch(relativeDir, pattern, options)) {
    yield options.absolute === true ? absoluteDir : relativeDir
  }
}

async function * _glob (base: string, dir: string, pattern: string, options: GlobOptions): AsyncGenerator<string, void, undefined> {
  for await (const entry of await fs.opendir(path.join(base, dir))) {
    const relativeEntryPath = path.join(dir, entry.name)
    const absoluteEntryPath = path.join(base, dir, entry.name)

    let match = minimatch(relativeEntryPath, pattern, options)

    const isDirectory = entry.isDirectory()

    if (isDirectory && options.nodir === true) {
      match = false
    }

    if (match) {
      yield options.absolute === true ? absoluteEntryPath : relativeEntryPath
    }

    if (isDirectory) {
      yield * _glob(base, relativeEntryPath, pattern, options)
    }
  }
}
