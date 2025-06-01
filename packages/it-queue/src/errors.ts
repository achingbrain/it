export class QueueFullError extends Error {
  static name = 'QueueFullError'

  constructor (message: string = 'The queue was full') {
    super(message)
    this.name = 'QueueFullError'
  }
}
