import { pushable } from 'it-pushable'

function isAsyncIterable <T> (thing: any): thing is AsyncIterable<T> {
  return thing[Symbol.asyncIterator] != null
}

/**
 * Treat one or more iterables as a single iterable.
 *
 * Nb. sources are iterated over in parallel so the
 * order of emitted items is not guaranteed.
 */
function merge <T> (...sources: Array<Iterable<T>>): Generator<T, void, undefined>
function merge <T> (...sources: Array<AsyncIterable<T> | Iterable<T>>): AsyncGenerator<T, void, undefined>
function merge <T> (...sources: Array<AsyncIterable<T> | Iterable<T>>): AsyncGenerator<T, void, undefined> | Generator<T, void, undefined> {
  const syncSources: Array<Iterable<T>> = []

  for (const source of sources) {
    if (!isAsyncIterable(source)) {
      syncSources.push(source)
    }
  }

  if (syncSources.length === sources.length) {
    // all sources are synchronous
    return (function * () {
      for (const source of syncSources) {
        yield * source
      }
    })()
  }

  return (async function * () {
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
  })()
}

export default merge
