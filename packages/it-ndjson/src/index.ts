/**
 * @packageDocumentation
 *
 * Turn (async)iterable values into JSON and back again.
 *
 * @example
 *
 * ```javascript
 * import ndjson from 'it-ndjson'
 * import all from 'it-all'
 *
 * // This can also be an iterator, async iterator, generator, etc
 * const values = [0, 1, 2, 3, 4]
 *
 * const arr = await all(ndjson.stringify(values))
 *
 * console.info(arr) // '0\n', '1\n', '2\n', '3\n', '4\n'
 *
 * const res = await all(ndjson.parse(arr))
 *
 * console.info(res) // [0, 1, 2, 3, 4]
 * ```
 */

export { default as parse } from './parse.js'
export { default as stringify } from './stringify.js'

export type { ParseOptions } from './parse.js'
