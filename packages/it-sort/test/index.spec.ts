import { expect } from 'aegir/chai'
import all from 'it-all'
import sort from '../src/index.js'
import type { CompareFunction } from '../src/index.js'

describe('it-sort', () => {
  it('should sort all entries of an iterator', () => {
    const values = ['foo', 'bar']
    const sorter: CompareFunction<string> = (a, b) => {
      return a.localeCompare(b)
    }

    const gen = sort(values, sorter)
    expect(gen[Symbol.iterator]).to.be.ok()

    const res = all(gen)
    expect(res).to.deep.equal(['bar', 'foo'])
  })

  it('should sort all entries of an async iterator', async () => {
    const values = async function * (): AsyncGenerator<string, void, undefined> {
      yield * ['foo', 'bar']
    }
    const sorter: CompareFunction<string> = (a, b) => {
      return a.localeCompare(b)
    }

    const gen = sort(values(), sorter)
    expect(gen[Symbol.asyncIterator]).to.be.ok()

    const res = await all(gen)
    expect(res).to.deep.equal(['bar', 'foo'])
  })
})
