/**
 * The incoming stream ended before a message was read
 */
export class UnexpectedEOFError extends Error {
  name = 'UnexpectedEOFError'
  code = 'ERR_UNEXPECTED_EOF'
}
