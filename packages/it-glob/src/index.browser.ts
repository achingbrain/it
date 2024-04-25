// eslint-disable-next-line require-yield
export default async function * glob (): AsyncGenerator<string, void, undefined> {
  throw new Error('it-glob does not work in browsers')
}
