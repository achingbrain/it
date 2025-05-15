import { expect } from 'aegir/chai'
import drain from 'it-drain'
import limitBytes from '../src/index.js'

function values (): Uint8Array[] {
  return [
    Uint8Array.from([0, 1, 2, 3]),
    Uint8Array.from([4, 5, 6, 7])
  ]
}

async function * asyncGenerator (vals: Uint8Array[]): AsyncGenerator<Uint8Array, void, undefined> {
  yield * vals
}

function * generator (vals: Uint8Array[]): Generator<Uint8Array, void, undefined> {
  yield * vals
}

describe('it-limit-bytes', () => {
  it('should limit an array', async () => {
    expect(() => {
      drain(limitBytes(values(), 5))
    }).to.throw('Read too many bytes')
  })

  it('should not limit an array', async () => {
    expect(() => {
      drain(limitBytes(values(), 10))
    }).to.not.throw()
  })

  it('should limit a generator', async () => {
    expect(() => {
      drain(limitBytes(generator(values()), 5))
    }).to.throw('Read too many bytes')
  })

  it('should not limit a generator', async () => {
    expect(() => {
      drain(limitBytes(generator(values()), 10))
    }).to.not.throw()
  })

  it('should limit an async generator', async () => {
    await expect((async () => {
      await drain(limitBytes(asyncGenerator(values()), 5))
    })()).to.eventually.be.rejected
      .with.property('message').that.include('Read too many bytes')
  })

  it('should not limit an async generator', async () => {
    await expect((async () => {
      await drain(limitBytes(asyncGenerator(values()), 10))
    })()).to.eventually.not.rejected()
  })
})
