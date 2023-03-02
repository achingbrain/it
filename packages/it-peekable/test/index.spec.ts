import { expect } from 'aegir/chai'
import all from 'it-all'
import peekableIt from '../src/index.js'

describe('it-peekable', () => {
  it('should peek at an iterable', async () => {
    const iterable = [0, 1, 2, 3]
    const peekable = peekableIt(iterable)
    const { value, done } = peekable.peek()

    expect(value).to.equal(0)
    expect(done).to.be.false()
  })

  it('should peek at an async iterable', async () => {
    const content = [0, 1, 2, 3]
    const iterable = async function * (): AsyncGenerator<number, void, unknown> {
      for (let i = 0; i < content.length; i++) {
        yield content[i]
      }
    }

    const peekable = peekableIt(iterable())
    const { value, done } = await peekable.peek()

    expect(value).to.equal(0)
    expect(done).to.be.false()
  })

  it('should push an iterable', async () => {
    const iterable = [0, 1, 2, 3]
    const peekable = peekableIt(iterable)
    const { value } = peekable.peek()

    if (value != null) {
      peekable.push(value)
    }

    expect([...peekable]).to.deep.equal(iterable)
  })

  it('should push an async iterable', async () => {
    const content = [0, 1, 2, 3]
    const iterable = async function * (): AsyncGenerator<number, void, unknown> {
      for (let i = 0; i < content.length; i++) {
        yield content[i]
      }
    }

    const peekable = peekableIt(iterable())
    const { value } = await peekable.peek()

    if (value != null) {
      peekable.push(value)
    }

    expect(await all(peekable)).to.deep.equal(content)
  })
})
