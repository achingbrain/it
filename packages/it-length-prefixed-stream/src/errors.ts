/**
 * The reported length of the next data message was not a positive integer
 */
export class InvalidMessageLengthError extends Error {
  name = 'InvalidMessageLengthError'
  code = 'ERR_INVALID_MSG_LENGTH'
}

/**
 * The reported length of the next data message was larger than the configured
 * max allowable value
 */
export class InvalidDataLengthError extends Error {
  name = 'InvalidDataLengthError'
  code = 'ERR_MSG_DATA_TOO_LONG'
}

/**
 * The varint used to specify the length of the next data message contained more
 * bytes than the configured max allowable value
 */
export class InvalidDataLengthLengthError extends Error {
  name = 'InvalidDataLengthLengthError'
  code = 'ERR_MSG_LENGTH_TOO_LONG'
}

/**
 * The incoming stream ended before the expected number of bytes were read
 */
export class UnexpectedEOFError extends Error {
  name = 'UnexpectedEOFError'
  code = 'ERR_UNEXPECTED_EOF'
}
