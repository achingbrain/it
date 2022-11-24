import { Uint8ArrayList } from 'uint8arraylist'

export interface SplitOptions {
  delimiter?: Uint8Array
}

/**
 * Splits Uint8Arrays emitted by an (async) iterable by a delimiter
 */
export default async function * split (source: AsyncIterable<Uint8Array>|Iterable<Uint8Array>, options: SplitOptions = {}): AsyncGenerator<Uint8Array, void, undefined> {
  const bl = new Uint8ArrayList()
  const delimiter = options.delimiter ?? new TextEncoder().encode('\n')

  for await (const buf of source) {
    bl.append(buf)

    yield * yieldUntilEnd(bl, delimiter)
  }

  yield * yieldUntilEnd(bl, delimiter)

  if (bl.length > 0) {
    yield bl.slice()
  }
}

async function * yieldUntilEnd (bl: Uint8ArrayList, delimiter: Uint8Array): AsyncGenerator<Uint8Array, void, undefined> {
  let index = bl.indexOf(delimiter)

  while (index !== -1) {
    yield bl.slice(0, index)

    bl.consume(index + delimiter.length)

    index = bl.indexOf(delimiter)
  }
}
