import batch from 'it-batch'

interface Success<T> {
  ok: true
  value: T
}

interface Failure {
  ok: false
  err: Error
}

/**
 * Takes an (async) iterator that emits promise-returning functions,
 * invokes them in parallel and emits the results as they become available but
 * in the same order as the input
 */
export default async function * parallelBatch <T> (source: AsyncIterable<() => Promise<T>> | Iterable<() => Promise<T>>, size: number = 1): AsyncGenerator<T, void, undefined> {
  for await (const tasks of batch(source, size)) {
    const things: Array<Promise<Success<T> | Failure>> = tasks.map(
      async (p: () => Promise<T>) => {
        return await p().then(value => ({ ok: true, value }), err => ({ ok: false, err }))
      })

    for (let i = 0; i < things.length; i++) {
      const result = await things[i]

      if (result.ok) {
        yield result.value
      } else {
        throw result.err
      }
    }
  }
}
