import all from 'it-all'
import { expect } from 'aegir/chai'
import forEach from '../src/index.js'

describe('it-for-each', () => {
  it('should iterate over every value', async () => {
    const values = [0, 1, 2, 3, 4]
    let sum = 0

    const res = await all(forEach(values, (val) => {
      sum += val
    }))

    expect(res).to.deep.equal(values)
    expect(10).to.equal(sum)
  })

  it('should abort source', async () => {
    const values = [0, 1, 2, 3, 4]
    let sum = 0
    const err = new Error('wat')

    try {
      await all(forEach(values, (val) => {
        sum += val

        if (val === 3) {
          throw err
        }
      }))

      throw new Error('Did not abort')
    } catch (e) {
      expect(e).to.equal(err)
      expect(6).to.equal(sum)
    }
  })
})
