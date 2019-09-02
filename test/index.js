import test from 'ava'
import all from 'async-iterator-all'
import glob from '../'

test('it should match file', async t => {
  const files = await all(glob('.', '**/*'))

  t.truthy(files.includes('README.md'))
})

test('it should match file in subdirectory', async t => {
  const files = await all(glob('.', '**/*'))

  t.truthy(files.includes('test/index.js'))
})

test('it should match one', async t => {
  const files = await all(glob('.', 'README.md'))

  t.deepEqual(files, ['README.md'])
})

test('it should match files', async t => {
  const files = await all(glob('README.md', 'README.md'))

  t.deepEqual(files, ['README.md'])
})

test('it should ignore files', async t => {
  const files = await all(glob('.', '**/*', {
    ignore: ['*/index.js']
  }))

  t.falsy(files.includes('test/index.js'))
})
