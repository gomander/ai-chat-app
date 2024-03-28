import { Role, Api, type Message, type RoleType, type ApiType } from '$types/common'

export function assertMessages(messages: unknown): asserts messages is Message[] {
  if (!Array.isArray(messages)) {
    throw new Error('Invalid messages')
  }
  for (const message of messages) {
    assertMessage(message)
  }
}

function assertMessage(message: unknown): asserts message is Message {
  if (
    !message ||
    typeof message !== 'object' ||
    !('role' in message) ||
    !('content' in message) ||
    typeof message.content !== 'string' ||
    message.content.trim().length < 2
  ) {
    throw new Error('Invalid message')
  }
  assertRole(message.role)
}

function assertRole(role: any): asserts role is RoleType {
  if (!Object.values(Role).includes(role)) {
    throw new Error('Invalid role')
  }
}

export function assertApi(api: any): asserts api is ApiType {
  if (!Object.values(Api).includes(api)) {
    throw new Error('Invalid API')
  }
}

export function getSafeApi(api: any): ApiType {
  return Object.values(Api).includes(api) ? api as ApiType : Api.ANTHROPIC
}

export function getSafeError(error: unknown): string {
  return error instanceof Error ? error.message : 'An error occurred'
}
