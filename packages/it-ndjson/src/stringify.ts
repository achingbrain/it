export default async function * stringify (source: AsyncIterable<any> | Iterable<any>): AsyncGenerator<string, void, undefined> {
  for await (const obj of source) {
    yield JSON.stringify(obj) + '\n'
  }
}
