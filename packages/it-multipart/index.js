'use strict'

const formidable = require('formidable')
const pushable = require('it-pushable')

/**
 * @typedef {import('http').IncomingMessage} IncomingMessage
 * @typedef {import('http').IncomingHttpHeaders} IncomingHttpHeaders
 * @typedef {Object} Part
 * @property {IncomingHttpHeaders} headers
 * @property {AsyncIterable<Buffer>} body
 */

/**
 * Streaming multipart HTTP message parser
 *
 * @param {IncomingMessage} request
 * @returns {AsyncIterable<Part>}
 */
async function * multipart (request) {
  const output = pushable()

  if (!request) {
    output.end(new Error('request missing'))

    yield * output

    return
  }

  const form = formidable({ keepExtensions: true })

  form.parse(request, err => {
    output.end(err)
  })

  form.onPart = (part) => {
    const body = pushable()

    part.on('data', buf => {
      body.push(buf)
    })
    part.on('end', () => {
      body.end()
    })
    part.on('error', (err) => {
      body.end(err)
    })

    output.push({
      headers: part.headers,
      body
    })
  }

  yield * output
}

module.exports = multipart
