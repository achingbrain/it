
interface Peek <T> {
  peek: () => IteratorResult<T, undefined>
}

interface AsyncPeek <T> {
  peek: () => Promise<IteratorResult<T, undefined>>
}

interface Push <T> {
  push: (value: T) => void
}

type Peekable <T> = Iterable<T> & Peek<T> & Push<T> & Iterator<T>

type AsyncPeekable <T> = AsyncIterable<T> & AsyncPeek<T> & Push<T> & AsyncIterator<T>

function peekable <T> (iterable: Iterable<T>): Peekable<T>
function peekable <T> (iterable: AsyncIterable<T>): AsyncPeekable<T>
function peekable <T> (iterable: Iterable<T> | AsyncIterable<T>): Peekable<T> | AsyncPeekable<T> {
  // @ts-expect-error
  const [iterator, symbol] = iterable[Symbol.asyncIterator] != null
    // @ts-expect-error
    ? [iterable[Symbol.asyncIterator](), Symbol.asyncIterator]
    // @ts-expect-error
    : [iterable[Symbol.iterator](), Symbol.iterator]

  const queue: any[] = []

  // @ts-expect-error
  return {
    peek: () => {
      return iterator.next()
    },
    push: (value: any) => {
      queue.push(value)
    },
    next: () => {
      if (queue.length > 0) {
        return {
          done: false,
          value: queue.shift()
        }
      }

      return iterator.next()
    },
    [symbol] () {
      return this
    }
  }
}

export default peekable
