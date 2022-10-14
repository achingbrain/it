const test = require('ava')
const http = require('http')
const handler = require('.')
// @ts-ignore
const fetch = require('node-fetch')
const FormData = require('form-data')

/** @type {string} */
let port
/** @type {import('http').Server} */
let server

test.before.cb((t) => {
  /**
   * @param {import('http').IncomingMessage} req
   */
  async function echo (req) {
    /** @type {Record<string, string>} */
    const files = {}

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
  }).listen(() => {
    // @ts-ignore - address() returns `null|string|object` and TS can't infer
    // it's last one even though it's inside listen callback.
    port = server.address().port
    t.end()
  })
})

test.after.cb((t) => {
  server.close(() => t.end())
})

test('it parses files from a multipart request', async (t) => {
  const formData = new FormData()
  formData.append('file-1.txt', Buffer.from('file 1 contents'))
  formData.append('file-2.txt', Buffer.from('file 2 contents'))

  const result = await fetch(`http://localhost:${port}`, {
    method: 'POST',
    headers: formData.getHeaders(),
    body: formData
  })

  t.is(result.status, 200)

  const response = await result.json()

  t.deepEqual(response, {
    'file-1.txt': 'file 1 contents',
    'file-2.txt': 'file 2 contents'
  })
})

test('it parses loads of files from multipart requests', async (t) => {
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

      t.is(result.status, 200)

      const response = await result.json()

      for (let i = 0; i < (10 * index); i++) {
        t.is(response[`file-${i}.txt`], `file ${i} contents`)
      }
    })
  )
})

test('it throws when request is not passed', async (t) => {
  await t.throwsAsync(async () => {
    for await (const _ of handler()) { // eslint-disable-line no-unused-vars

    }
  }, { message: 'request missing' })
})

test('it throws when request is not multipart', async (t) => {
  const result = await fetch(`http://localhost:${port}`, {
    method: 'POST',
    body: 'not multipart'
  })

  t.is(result.status, 400)
})
