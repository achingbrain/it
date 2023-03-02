import { pushable } from 'it-pushable'

/**
 * Treat one or more iterables as a single iterable.
 *
 * Nb. sources are iterated over in parallel so the
 * order of emitted items is not guaranteed.
 */
export default async function * merge <T> (...sources: Array<AsyncIterable<T> | Iterable<T>>): AsyncGenerator<T, void, undefined> {
  const output = pushable<T>({
    objectMode: true
  })

  void Promise.resolve().then(async () => {
    try {
      await Promise.all(
        sources.map(async (source) => {
          for await (const item of source) {
            output.push(item)
          }
        })
      )

      output.end()
    } catch (err: any) {
      output.end(err)
    }
  })

  yield * output
}
