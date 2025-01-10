import { isUint8ArrayList } from 'uint8arraylist'
import { InvalidMessageLengthError } from './errors.js'
import type { Uint8ArrayList } from 'uint8arraylist'

export interface ParseOptions {
  /**
   * Limit the possible size of incoming serialized messages in bytes
   */
  maxMessageLength?: number
}

export default async function * parse <T> (source: AsyncIterable<Uint8Array | Uint8ArrayList | string> | Iterable<Uint8Array | Uint8ArrayList | string>, opts: ParseOptions = {}): AsyncGenerator<T, void, undefined> {
  const matcher = /\r?\n/
  const decoder = new TextDecoder('utf8')
  let buffer = ''

  for await (let chunk of source) {
    if (typeof chunk === 'string') {
      chunk = new TextEncoder().encode(chunk)
    }

    if (isUint8ArrayList(chunk)) {
      chunk = chunk.subarray()
    }

    buffer += decoder.decode(chunk, { stream: true })

    if (buffer.length > (opts?.maxMessageLength ?? buffer.length)) {
      throw new InvalidMessageLengthError('Incoming message too long')
    }

    const parts = buffer.split(matcher)
    buffer = parts.pop() ?? ''

    for (let i = 0; i < parts.length; i++) {
      yield JSON.parse(parts[i])
    }
  }

  buffer += decoder.decode()

  if (buffer !== '') {
    yield JSON.parse(buffer)
  }
}
