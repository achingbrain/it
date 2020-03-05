import test from 'ava'
import http from 'http'
import handler from '.'
import fetch from 'node-fetch'
import FormData from 'form-data'

let port
let server

test.before.cb((t) => {
  async function echo (req) {
    const files = {}

    for await (const part of handler(req)) {
      const name = part.headers['content-disposition'].match(/name="([^"]+)"/)[1]

      files[name] = ''

      for await (const str of part.body) {
        files[name] += str
      }
    }

    return JSON.stringify(files)
  }

  server = http.createServer((req, res) => {
    if (req.method === 'POST' &&
      req.headers['content-type'].includes('multipart/form-data') &&
      req.headers['content-type'].includes('boundary=')
    ) {
      echo(req)
        .then((files) => {
          res.writeHead(200, {
            'content-type': 'application/json'
          })
          res.end(files)
        })
        .catch(err => {
          console.error(err)

          res.writeHead(500)
          res.end(err.stack)
        })

      return
    }

    res.writeHead(404)
    res.end()
  }).listen(() => {
    port = server.address().port
    t.end()
  })
})

test.after.cb((t) => {
  server.close(() => t.end())
})

test('it parses files from a multipart request', async (t) => {
  const formData = new FormData()
  formData.append('file-1', Buffer.from('file 1 contents'), 'file-1.txt')
  formData.append('file-2', Buffer.from('file 2 contents'), 'file-2.txt')
  formData.append('file-3', Buffer.from('file 3 contènts'), 'filé-3.txt')

  const result = await fetch(`http://localhost:${port}`, {
    method: 'POST',
    headers: formData.getHeaders(),
    body: formData
  })

  t.is(result.status, 200)

  const response = await result.json()

  t.deepEqual(response, {
    'file-1': 'file 1 contents',
    'file-2': 'file 2 contents',
    'file-3': 'file 3 contènts'
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

test('it throws if not handed a multipart request', async (t) => {
  await t.throwsAsync(async () => {
    for await (const _ of handler()) { // eslint-disable-line no-unused-vars

    }
  }, 'Not a multipart request')
})
