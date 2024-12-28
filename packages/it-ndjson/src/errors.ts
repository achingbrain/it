/**
 * A serialized message was received that was too large
 */
export class InvalidMessageLengthError extends Error {
  name = 'InvalidMessageLengthError'
  code = 'ERR_INVALID_MESSAGE_LENGTH'
}
