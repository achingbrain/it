/**
 * @packageDocumentation
 *
 * Like [`glob`](https://npmjs.com/package/glob) but async iterable.
 *
 * File separators on Windows will be yielded as `/` and not `\`.
 *
 * @example
 *
 * ```javascript
 * import glob from 'it-glob'
 *
 * // All options are passed through to fast-glob
 * const options = {}
 *
 * for await (const path of glob('/path/to/file', '**\/*', options)) {
 *  console.info(path)
 * }
 * ```
 *
 * See the [fast-glob docs](https://github.com/mrmlnc/fast-glob#options-3) for the full list of options.
 */

import fs from 'node:fs/promises'
import path from 'node:path'
import fastGlob from 'fast-glob'
import type { Options } from 'fast-glob'

export type { Options }

/**
 * Async iterable filename pattern matcher
 */
export default async function * glob (dir: string, pattern: string, options: Options = {}): AsyncGenerator<string, void, undefined> {
  const absoluteDir = path.resolve(dir)
  const stats = await fs.stat(absoluteDir)

  for await (const entry of fastGlob.stream(pattern, {
    ...options,
    cwd: stats.isDirectory() ? dir : process.cwd()
  })) {
    yield entry.toString()
  }
}
