import BufferList from 'bl/BufferList.js'

export interface SplitOptions {
  delimiter?: Uint8Array
}

/**
 * Splits Uint8Arrays emitted by an (async) iterable by a delimiter
 */
export default async function * split (source: AsyncIterable<Uint8Array>|Iterable<Uint8Array>, options: SplitOptions = {}): AsyncGenerator<Uint8Array, void, undefined> {
  const bl = new BufferList()
  const delimiter = options.delimiter ?? new TextEncoder().encode('\n')

  for await (const buf of source) {
    // @ts-expect-error Uint8Array type is missing from add signature
    bl.append(buf)

    yield * yieldUntilEnd(bl, delimiter)
  }

  yield * yieldUntilEnd(bl, delimiter)

  if (bl.length > 0) {
    yield bl.slice()
  }
}

async function * yieldUntilEnd (bl: BufferList, delimiter: Uint8Array): AsyncGenerator<Uint8Array, void, undefined> {
  let index = bl.indexOf(delimiter)

  while (index !== -1) {
    yield bl.slice(0, index)

    bl.consume(index + delimiter.length)

    index = bl.indexOf(delimiter)
  }
}
