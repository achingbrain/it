# it-multipart <!-- omit in toc -->

[![codecov](https://img.shields.io/codecov/c/github/achingbrain/it.svg?style=flat-square)](https://codecov.io/gh/achingbrain/it)
[![CI](https://img.shields.io/github/workflow/status/achingbrain/it/test%20&%20maybe%20release/master?style=flat-square)](https://github.com/achingbrain/it/actions/workflows/js-test-and-release.yml)

> Async iterable http multipart message parser

## Table of contents <!-- omit in toc -->

- [Install](#install)
- [Example](#example)
- [License](#license)
- [Contribute](#contribute)

## Install

```console
$ npm i it-multipart
```

## Example

```javascript
import http from 'http'
import multipart from 'it-multipart'

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

## License

Licensed under either of

- Apache 2.0, ([LICENSE-APACHE](LICENSE-APACHE) / <http://www.apache.org/licenses/LICENSE-2.0>)
- MIT ([LICENSE-MIT](LICENSE-MIT) / <http://opensource.org/licenses/MIT>)

## Contribute

Unless you explicitly state otherwise, any contribution intentionally submitted for inclusion in the work by you, as defined in the Apache-2.0 license, shall be dual licensed as above, without any additional terms or conditions.
