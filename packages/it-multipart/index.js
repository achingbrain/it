'use strict'

const { Buffer } = require('buffer')
/** @type {(source:Buffer, search:Buffer, index?:number) => number} */
// @ts-ignore
const bIndexOf = require('buffer-indexof')
/** @typedef {function(string):IncomingHttpHeaders} */
// @ts-ignore
const parseHeaders = require('parse-headers')

module.exports = multipart

/**
 * @typedef {import('http').IncomingHttpHeaders} IncomingHttpHeaders
 */

/**
 * @template T
 * @typedef {AsyncIterable<T> & AsyncIterator<T>} It
 */

/**
 * Streaming multipart HTTP message parser
 * @param {import('http').IncomingMessage} source
 * @param {string} [boundary]
 * @returns {AsyncIterable<{headers:IncomingHttpHeaders, body:It<Buffer>}>}
 */
async function * multipart (source, boundary) {
  if (!boundary) {
    if (source && source.headers && source.headers['content-type'] && source.headers['content-type'].includes('boundary')) {
      boundary = source.headers['content-type'].split('boundary=')[1].trim()
    } else {
      throw new Error('Not a multipart request')
    }
  }

  boundary = `--${boundary}`
  const headerEnd = Buffer.from('\r\n\r\n')

  // allow pushing data back into stream
  const stream = prefixStream(source)

  // consume initial boundary
  await consumeUntilAfter(stream, Buffer.from(boundary))

  for await (const chunk of stream) {
    stream.push(chunk)

    const headers = (await collect(yieldUntilAfter(stream, headerEnd))).toString()

    // the final boundary has `--\r\n` appended to it
    if (headers === '--\r\n') {
      return
    }

    // wait for this part's body to be consumed before we try reading the next one
    const result = waitForStreamToBeConsumed(yieldUntilAfter(stream, Buffer.from(`\r\n${boundary}`)))

    const part = {
      headers: parseHeaders(headers),
      body: result.iterator
      // body: yieldUntilAfter(stream, Buffer.from(`\r\n${boundary}`))
    }

    yield part

    await result.complete
  }
}

/**
 * Yield chunks of haystack until the needle is reached. Consume the needle
 * without yielding it
 * @param {PrefixStream<Buffer>} haystack
 * @param {Buffer} needle
 * @returns {AsyncIterable<Buffer>}
 */
async function * yieldUntilAfter (haystack, needle) {
  let buffer = Buffer.alloc(0)

  for await (const chunk of haystack) {
    buffer = Buffer.concat([buffer, chunk], buffer.length + chunk.length) // slow

    const index = bIndexOf(buffer, needle)

    if (index !== -1) {
      // found needle
      if (index > 0) {
        yield buffer.slice(0, index)
      }

      // consume needle but preserve rest of chunk
      haystack.push(buffer.slice(index + needle.length))

      return
    }

    if (buffer.length > needle.length) {
      // can emit the beginning chunk as it does not contain the needle
      yield buffer.slice(0, buffer.length - needle.length)

      // cache the rest for next time
      buffer = buffer.slice(buffer.length - needle.length)
    }
  }

  // yield anything left over
  if (buffer.length) {
    yield buffer
  }
}

/**
 * @param {PrefixStream<Buffer>} haystack
 * @param {Buffer} needle
 * @returns {Promise<void>}
 */
async function consumeUntilAfter (haystack, needle) {
  for await (const _chunk of yieldUntilAfter(haystack, needle)) { // eslint-disable-line no-unused-vars

  }
}

/**
 * @template T
 * @typedef {Object} PrefixPush
 * @property {function(T):void} push
 */

/**
 * @template T
 * @typedef {It<T> & PrefixPush<T>} PrefixStream
 */

/**
 * a stream that lets us push content back into it for consumption elsewhere
 * @param {AsyncIterable<Buffer>} stream
 * @returns {PrefixStream<Buffer>}
 */
function prefixStream (stream) {
  /** @type {Buffer[]} */
  const buffer = []
  const streamIterator = stream[Symbol.asyncIterator]()

  const iterator = {
    [Symbol.asyncIterator]: () => {
      return iterator
    },
    next: async () => {
      if (buffer.length) {
        return {
          done: false,
          /** @type {Buffer} */
          value: (buffer.shift())
        }
      }

      return streamIterator.next()
    },
    /**
     * @param {Buffer} buf
     */
    push: function (buf) {
      buffer.push(buf)
    }
  }

  return iterator
}

/**
 * @param {AsyncIterable<Buffer>} stream
 * @returns {{complete:Promise<void>, iterator:It<Buffer>}}
 */
function waitForStreamToBeConsumed (stream) {
  /** @type {{resolve(value?:any):void, reject(error:Error):void}} */
  let pending
  const complete = new Promise((resolve, reject) => {
    pending = {
      resolve,
      reject
    }
  })
  const streamIterator = stream[Symbol.asyncIterator]()

  const iterator = {
    [Symbol.asyncIterator]: () => {
      return iterator
    },
    next: async () => {
      try {
        const next = await streamIterator.next()

        if (next.done) {
          pending.resolve()
        }

        return next
      } catch (err) {
        // By rejecting `completion` propagate error to the
        // A. `for await (cons part of multipart(...))`
        // By throwing we propagate error to the
        // B. `for await (const chunk of part.body)`
        // We need to do both because if we just do A. error will not appear to
        // the consumer of `part.body`, furthermore A might break a loop before
        // completion and error may get swallowed.
        pending.reject(err)
        throw err
      }
    }
  }

  return {
    complete,
    iterator
  }
}

/**
 * @param {AsyncIterable<Buffer>} stream
 * @returns {Promise<Buffer>}
 */
const collect = async (stream) => {
  const buffers = []
  let size = 0

  for await (const buf of stream) {
    size += buf.length
    buffers.push(buf)
  }

  return Buffer.concat(buffers, size)
}
