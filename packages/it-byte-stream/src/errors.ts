/**
 * The incoming stream ended before the expected number of bytes were read
 */
export class UnexpectedEOFError extends Error {
  name = 'UnexpectedEOFError'
  code = 'ERR_UNEXPECTED_EOF'
}
