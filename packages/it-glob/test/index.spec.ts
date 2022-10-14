import { expect } from 'aegir/chai'
import all from 'it-all'
import glob from '../src/index.js'
import path from 'path'
import { dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

describe('it-glob', () => {
  it('should match file', async () => {
    const files = await all(glob('.', '**/*'))

    expect(files.includes('README.md')).to.be.true()
  })

  it('should match file in subdirectory', async () => {
    const files = await all(glob('.', '**/*'))

    expect(files.includes(path.join('dist', 'src', 'index.d.ts'))).to.be.true()
  })

  it('should match one', async () => {
    const files = await all(glob('.', 'README.md'))

    expect(files).to.deep.equal(['README.md'])
  })

  it('should match files', async () => {
    const files = await all(glob('README.md', 'README.md'))

    expect(files).to.deep.equal(['README.md'])
  })

  it('should ignore files', async () => {
    const files = await all(glob('.', '**/*!(*/index.js|**/dist/**)'))

    expect(files.includes('test/index.js')).to.be.false()
  })

  it('should ignore files from absolute directory', async () => {
    const files = await all(glob(__dirname, '**/*!(test/index.js|)**/dist/**'))

    expect(files.includes(path.resolve(__dirname, 'index.js'))).to.be.false()
  })

  it('should return absolute paths', async () => {
    const files = await all(glob(__dirname, '**/*', {
      absolute: true
    }))

    files.forEach(file => {
      expect(path.isAbsolute(file)).to.be.true()
    })
  })

  it('should return relative paths', async () => {
    const files = await all(glob(__dirname, '**/*', {
      absolute: false
    }))

    files.forEach(file => {
      expect(path.isAbsolute(file)).to.be.false()
    })
  })

  it('should match directories', async () => {
    const files = await all(glob(path.resolve(__dirname, '..', '..'), 'dist/*'))

    expect(files.includes(path.join('dist', 'src'))).to.be.true()
  })

  it('should skip directories', async () => {
    const files = await all(glob(path.resolve(__dirname, '..', '..'), 'dist/**/*', {
      nodir: true,
      dot: true
    }))

    expect(files.includes(path.join('dist', 'src'))).to.be.false()
    expect(files.includes(path.join('dist', 'src', 'index.js'))).to.be.true()
  })
})
