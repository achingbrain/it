
/**
 * @param {AsyncIterable<any> | Iterable<any>} source
 */
async function * stringify (source) {
  for await (const obj of source) {
    yield JSON.stringify(obj) + '\n'
  }
}

module.exports = stringify
