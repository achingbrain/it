/* eslint-env mocha, browser */

'use strict'

const all = require('it-all')
const { expect } = require('chai')
const toIt = require('./index')

describe('browser-readablestream-to-it', () => {
  it('should convert a readablestream to an async iterator', async () => {
    const content = [0, 1, 2, 3, 4]

    const stream = new ReadableStream({
      start (controller) {
        for (let i = 0; i < content.length; i++) {
          controller.enqueue(content[i])
        }

        controller.close()
      }
    })

    const result = await all(toIt(stream))

    expect(result).to.deep.equal(content)
  })
})
