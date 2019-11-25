'use strict'

import parallelBatch from './'
import test from 'ava'
import all from 'it-all'
import delay from 'delay'

test('Should batch up emitted arrays', async (t) => {
  async function * iterator (values) {
    yield * values
  }

  const input = [
    async () => {
      await delay(5000)

      return 1
    },
    async () => {
      await delay(1000)

      return 2
    }
  ]

  const res = await all(parallelBatch(iterator(input), 2))

  t.deepEqual(res, [1, 2])
})
