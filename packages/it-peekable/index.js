'use strict'

function peekableIterator (iterable) {
  const iterator = iterable[Symbol.asyncIterator] ? iterable[Symbol.asyncIterator]() : iterable[Symbol.iterator]()
  const queue = []

  const peekable = {
    peek: () => {
      return iterator.next()
    },
    push: (value) => {
      queue.push(value)
    },
    next: () => {
      if (queue.length) {
        return {
          done: false,
          value: queue.shift()
        }
      }

      return iterator.next()
    }
  }

  if (iterable[Symbol.asyncIterator]) {
    peekable[Symbol.asyncIterator] = () => {
      return peekable
    }
  } else {
    peekable[Symbol.iterator] = () => {
      return peekable
    }
  }

  return peekable
}

module.exports = peekableIterator
