# it-multipart

[![codecov](https://img.shields.io/codecov/c/github/achingbrain/it.svg?style=flat-square)](https://codecov.io/gh/achingbrain/it)
[![CI](https://img.shields.io/github/actions/workflow/status/achingbrain/it/js-test-and-release.yml?branch=main\&style=flat-square)](https://github.com/achingbrain/it/actions/workflows/js-test-and-release.yml?query=branch%3Amain)

> Async iterable http multipart message parser

# About

<!--

!IMPORTANT!

Everything in this README between "# About" and "# Install" is automatically
generated and will be overwritten the next time the doc generator is run.

To make changes to this section, please update the @packageDocumentation section
of src/index.js or src/index.ts

To experiment with formatting, please run "npm run docs" from the root of this
repo and examine the changes made.

-->

Allows iterating over multipart messages found in a HTTP request/

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

# Install

```console
$ npm i it-multipart
```

# API Docs

- <https://achingbrain.github.io/it/modules/it_multipart.html>

# License

Licensed under either of

- Apache 2.0, ([LICENSE-APACHE](https://github.com/achingbrain/it/blob/main/packages/it-multipart/LICENSE-APACHE) / <http://www.apache.org/licenses/LICENSE-2.0>)
- MIT ([LICENSE-MIT](https://github.com/achingbrain/it/blob/main/packages/it-multipart/LICENSE-MIT) / <http://opensource.org/licenses/MIT>)

# Contribution

Unless you explicitly state otherwise, any contribution intentionally submitted for inclusion in the work by you, as defined in the Apache-2.0 license, shall be dual licensed as above, without any additional terms or conditions.
