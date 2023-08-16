export default async function * parse <T> (source: AsyncIterable<Uint8Array | string> | Iterable<Uint8Array | string>): AsyncGenerator<T, void, undefined> {
  const matcher = /\r?\n/
  const decoder = new TextDecoder('utf8')
  let buffer = ''

  for await (let chunk of source) {
    if (typeof chunk === 'string') {
      chunk = new TextEncoder().encode(chunk)
    }

    buffer += decoder.decode(chunk, { stream: true })
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
