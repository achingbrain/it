import { expect } from 'aegir/chai'
import all from 'it-all'
import sort, { CompareFunction } from '../src/index.js'

describe('it-sort', () => {
  it('should sort all entries of an array', async () => {
    const values = ['foo', 'bar']
    const sorter: CompareFunction<string> = (a, b) => {
      return a.localeCompare(b)
    }

    const res = await all(sort(values, sorter))

    expect(res).to.deep.equal(['bar', 'foo'])
  })
})
