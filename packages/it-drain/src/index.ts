/**
 * Drains an (async) iterable discarding its' content and does not return
 * anything
 */
export default async function drain (source: AsyncIterable<unknown> | Iterable<unknown>): Promise<void> {
  for await (const _ of source) { } // eslint-disable-line no-unused-vars,no-empty,@typescript-eslint/no-unused-vars
}
