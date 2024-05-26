import { MissingInvocationError, MissingParentScopeError } from './errors.js'
import type { Invocation } from './index.js'

interface MethodMessage {
  scope: string
}

interface CallbackMessage {
  parents: string[]
}

function isCallbackMessage (message: any): message is CallbackMessage {
  return message.parents != null
}

export function lookUpScope (message: MethodMessage | CallbackMessage, invocations: Map<string, Invocation>): Invocation {
  if (isCallbackMessage(message)) {
    return lookUpChildScope(message.parents, invocations)
  }

  const invocation = invocations.get(message.scope)

  if (invocation == null) {
    throw new MissingInvocationError()
  }

  return invocation
}

function lookUpChildScope (parents: string[], invocations: Map<string, Invocation>): Invocation {
  let invocation: Invocation | undefined

  for (const parent of parents) {
    if (invocation == null) {
      invocation = invocations.get(parent)

      if (invocation == null) {
        throw new MissingParentScopeError()
      }

      continue
    }

    invocation = invocation.children.get(parent)

    if (invocation == null) {
      throw new MissingParentScopeError()
    }
  }

  if (invocation == null) {
    throw new MissingParentScopeError()
  }

  return invocation
}
