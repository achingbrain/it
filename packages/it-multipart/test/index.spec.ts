import { expect } from 'aegir/chai'
import http from 'http'
import handler from '../src/index.js'
import fetch from 'node-fetch'
import FormData from 'form-data'
import drain from 'it-drain'
import type { Server, IncomingMessage } from 'http'

describe('it-multipart', () => {
  let port: string
  let server: Server

  before(async () => {
    async function echo (req: IncomingMessage) {
      const files: Record<string, string> = {}

      for await (const part of handler(req)) {
        // @ts-ignore - header may not be present
        const name = part.headers['content-disposition'].match(/name="(.*)"/)[1]

        files[name] = ''

        for await (const str of part.body) {
          files[name] += str
        }
      }

      return JSON.stringify(files)
    }

    port = await new Promise<string>((resolve, reject) => {
      server = http.createServer((req, res) => {
        echo(req)
          .then((files) => {
            res.writeHead(200, {
              'content-length': files.length,
              'content-type': 'application/json'
            })
            res.end(files)
          })
          .catch(err => {
            if (err.message.includes('bad content-type header')) {
              res.writeHead(400)
            } else {
              res.writeHead(500)
            }

            res.end(err.stack)
          })
      })
      server.on('error', (err) => {
        console.info('start failed', err)
        reject(err)
      })
      server.listen(() => {
        // @ts-expect-error - address() returns `null|string|object` and TS can't infer
        // it's last one even though it's inside listen callback.
        resolve(server.address().port)
      })
    })
  })

  after((cb) => {
    if (port != null && server != null) {
      server.close(() => {
        cb()
      })
    }
  })

  it('should parse files from a multipart request', async () => {
    const formData = new FormData()
    formData.append('file-1.txt', Buffer.from('file 1 contents'))
    formData.append('file-2.txt', Buffer.from('file 2 contents'))

    const result = await fetch(`http://127.0.0.1:${port}`, {
      method: 'POST',
      headers: formData.getHeaders(),
      body: formData
    })

    expect(result.status).to.equal(200)

    const response = await result.json()

    expect(response).to.deep.equal({
      'file-1.txt': 'file 1 contents',
      'file-2.txt': 'file 2 contents'
    })
  })

  it('should parse loads of files from multipart requests', async () => {
    await Promise.all(
      [1, 2, 3, 4, 5].map(async (index) => {
        const formData = new FormData()

        for (let i = 0; i < (100 * index); i++) {
          formData.append(`file-${i}.txt`, Buffer.from(`file ${i} contents`))
        }

        const result = await fetch(`http://localhost:${port}`, {
          method: 'POST',
          headers: formData.getHeaders(),
          body: formData
        })

        expect(result.status).to.equal(200)

        const response: any = await result.json()

        for (let i = 0; i < (10 * index); i++) {
          expect(response[`file-${i}.txt`]).to.equal(`file ${i} contents`)
        }
      })
    )
  })

  it('should throw when request is not passed', async () => {
    // @ts-expect-error missing argument
    await expect(drain(handler())).to.eventually.be.rejected().with.property('message', 'request missing')
  })

  it('should throw when request is not multipart', async () => {
    const result = await fetch(`http://localhost:${port}`, {
      method: 'POST',
      body: 'not multipart'
    })

    expect(result.status).to.equal(400)
  })
})
