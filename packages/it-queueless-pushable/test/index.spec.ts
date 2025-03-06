import { expect } from 'aegir/chai'
import delay from 'delay'
import all from 'it-all'
import drain from 'it-drain'
import { queuelessPushable } from '../src/index.js'

describe('it-queueless-pushable', () => {
  it('should return a value', async () => {
    const pushable = queuelessPushable<string>()

    void Promise.resolve().then(async () => {
      await pushable.push('hello')
    })

    const result = await pushable.next()
    expect(result).to.deep.equal({
      done: false,
      value: 'hello'
    })
  })

  it('should wait for the value to be consumed before accepting another value', async () => {
    const pushable = queuelessPushable<string>()
    const actions: string[] = []

    void Promise.resolve().then(async () => {
      actions.push('push hello')
      await pushable.push('hello')
      actions.push('push world')
      await pushable.push('world')
      actions.push('end queue')
      await pushable.end()
    })

    while (true) {
      const result = await pushable.next()

      if (result.done === true) {
        break
      }

      actions.push(`consume ${result.value}`)
    }

    expect(actions).to.deep.equal([
      'push hello',
      'consume hello',
      'push world',
      'consume world',
      'end queue'
    ])
  })

  it('should be consumable as an async iterator', async () => {
    const pushable = queuelessPushable<string>()

    void Promise.resolve().then(async () => {
      await pushable.push('hello')
      await pushable.push('world')
      await pushable.end()
    })

    await expect(all(pushable)).to.eventually.deep.equal([
      'hello',
      'world'
    ])
  })

  it('should end with an error', async () => {
    const err = new Error('Urk!')
    const pushable = queuelessPushable<string>()

    void Promise.resolve().then(async () => {
      await pushable.push('hello')
      await pushable.push('world')
      await pushable.end(err)
    })

    await expect(all(pushable)).to.eventually.be.rejectedWith(err.message)
  })

  it('should return', async () => {
    const pushable = queuelessPushable<string>()

    void Promise.resolve().then(async () => {
      await pushable.push('hello')
      await pushable.push('world')
      await pushable.return()
    })

    await expect(all(pushable)).to.eventually.be.ok()
  })

  it('should return early', async () => {
    const pushable = queuelessPushable<string>()

    void pushable.push('hello')
    void pushable.push('world')

    let output: string | undefined

    for await (const str of pushable) {
      if (str === 'hello') {
        output = str
        break
      }
    }

    expect(output).to.equal('hello')
  })

  it('should not be pushable after ending', async () => {
    const pushable = queuelessPushable<string>()

    void drain(pushable)

    await pushable.push('hello')
    await pushable.push('world')
    await pushable.end()

    await expect(pushable.push('nope!')).to.eventually.be.rejectedWith('Cannot push value onto an ended pushable')
  })

  it('should push in order even it promises are unawaited', async () => {
    const pushable = queuelessPushable<string>()

    void pushable.push('hello')
    void pushable.push('world')
    void pushable.end()

    await expect(all(pushable)).to.eventually.deep.equal([
      'hello',
      'world'
    ])
  })

  it('should abort pushing if consumer is slow', async () => {
    const pushable = queuelessPushable<string>()

    await expect(pushable.push('hello', {
      signal: AbortSignal.timeout(100)
    })).to.eventually.be.rejected()
  })

  it('should not cause an unhandled promise rejection if the queue is aborted without a listener', async () => {
    const err = new Error('Urk!')
    const pushable = queuelessPushable<string>()
    void pushable.throw(err)

    // wait until a future tick to allow promise to reject without being caught
    await delay(10)

    await expect(pushable.next()).to.eventually.be.rejectedWith(err.message)
  })
})
