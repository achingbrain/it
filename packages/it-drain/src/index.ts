function isAsyncIterable <T> (thing: any): thing is AsyncIterable<T> {
  return thing[Symbol.asyncIterator] != null
}

/**
 * Drains an (async) iterable discarding its' content and does not return
 * anything
 */
function drain (source: Iterable<unknown>): void
function drain (source: Iterable<unknown> | AsyncIterable<unknown>): Promise<void>
function drain (source: Iterable<unknown> | AsyncIterable<unknown>): Promise<void> | void {
  if (isAsyncIterable(source)) {
    return (async () => {
      for await (const _ of source) { } // eslint-disable-line no-unused-vars,no-empty,@typescript-eslint/no-unused-vars
    })()
  } else {
    for (const _ of source) { } // eslint-disable-line no-unused-vars,no-empty,@typescript-eslint/no-unused-vars
  }
}

export default drain
