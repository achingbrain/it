/**
 * @param {AsyncIterable<Uint8Array> | Iterable<Uint8Array>} source
 */
async function * parse (source) {
  const matcher = /\r?\n/
  const decoder = new TextDecoder('utf8')
  let buffer = ''

  for await (let chunk of source) {
    if (typeof chunk === 'string') {
      chunk = new TextEncoder().encode(chunk)
    }

    buffer += decoder.decode(chunk, { stream: true })
    const parts = buffer.split(matcher)
    buffer = parts.pop() || ''

    for (let i = 0; i < parts.length; i++) {
      yield JSON.parse(parts[i])
    }
  }

  buffer += decoder.decode()

  if (buffer) {
    yield JSON.parse(buffer)
  }
}

module.exports = parse
