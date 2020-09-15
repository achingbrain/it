const toBrowserReadbleStream = require('./')
const test = require('ava')

test('Should export something', async (t) => {
  t.true(typeof toBrowserReadbleStream === 'function')
})
