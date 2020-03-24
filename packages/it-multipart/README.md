# it-multipart

[![Build status](https://travis-ci.org/achingbrain/it.svg?branch=master)](https://travis-ci.org/achingbrain/it?branch=master) [![Coverage Status](https://coveralls.io/repos/github/achingbrain/it/badge.svg?branch=master)](https://coveralls.io/github/achingbrain/it?branch=master) [![Dependencies Status](https://david-dm.org/achingbrain/it/status.svg?path=packages/it-multipart)](https://david-dm.org/achingbrain/it?path=packages/it-multipart)

> Streaming multipart HTTP message parser

## Example

```javascript
const http = require('http')
const multipart = require('it-multipart')

http.createServer(async (req, res) => {
  if (req.method === 'POST' && req.headers['content-type']) {
    for await (const part of multipart(req)) {
      console.log(`part with HTTP headers ${part.headers}`)

      // nb. part.body must be consumed before the next part is emitted
      for await (const chunk of part.body) {
        console.log(`part with content ${part.name} contents:`, chunk.toString())
      }
    }

    console.log('finished parsing')
    res.writeHead(200)
    res.end()
  }

  res.writeHead(404)
  res.end()
}).listen(5001, () => {
  console.log('server listening on port 5001')
})
```
