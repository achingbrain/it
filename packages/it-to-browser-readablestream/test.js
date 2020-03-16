import toBrowserReadbleStream from './'
import test from 'ava'

test('Should export something', async (t) => {
  t.true(typeof toBrowserReadbleStream === 'function')
})
