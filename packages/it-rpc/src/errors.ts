export class MethodNotFoundError extends Error {
  constructor (message = 'Method not found') {
    super(message)
    this.name = 'MethodNotFoundError'
  }
}

export class InvalidMethodError extends Error {
  constructor (message = 'Invocation target was not a function') {
    super(message)
    this.name = 'InvalidMethodError'
  }
}

export class UnsupportedValueTypeError extends Error {
  constructor (message = 'Unsupported value type') {
    super(message)
    this.name = 'UnsupportedValueTypeError'
  }
}

export class DuplicateTargetNameError extends Error {
  constructor (message = 'Cannot reuse RPC target name') {
    super(message)
    this.name = 'DuplicateTargetNameError'
  }
}

export class DuplicateScopeError extends Error {
  constructor (message = 'Duplicate scope') {
    super(message)
    this.name = 'DuplicateScopeError'
  }
}

export class InvalidReturnTypeError extends Error {
  constructor (message = 'Invalid response type') {
    super(message)
    this.name = 'InvalidResponseTypeError'
  }
}

export class InvalidInvocationTypeError extends Error {
  constructor (message = 'Invocation target was not a function') {
    super(message)
    this.name = 'InvalidInvocationTypeError'
  }
}

export class MissingParentScopeError extends Error {
  constructor (message = 'Parent invocation scope not found') {
    super(message)
    this.name = 'MissingParentScopeError'
  }
}

export class MissingCallbackError extends Error {
  constructor (message = 'Callback not found') {
    super(message)
    this.name = 'MissingCallbackError'
  }
}
