import { expect } from 'aegir/chai'
import toBrowserReadbleStream from '../src/index.js'

describe('it-to-browser-readable-stream', () => {
  it('should export something', async () => {
    expect(typeof toBrowserReadbleStream).to.equal('function')
  })
})
