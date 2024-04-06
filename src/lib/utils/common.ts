import { DEFAULT_API } from '$lib/data/constants'
import models, { getDefaultModel } from '$lib/data/models'
import { Role, Api } from '$types/common'
import type { Message, RoleType, ApiType, ApiMessage, Model } from '$types/common'

export function assertApiMessages(messages: unknown): asserts messages is ApiMessage[] {
  if (!Array.isArray(messages)) {
    throw new Error('Invalid messages')
  }
  for (const message of messages) {
    assertApiMessage(message)
  }
}

function assertApiMessage(message: unknown): asserts message is ApiMessage {
  if (
    !message ||
    typeof message !== 'object' ||
    !('role' in message) ||
    !('content' in message) ||
    typeof message.content !== 'string' ||
    !message.content.trim().length
  ) {
    throw new Error('Invalid message')
  }
  if ('id' in message) {
    delete message.id
  }
  assertRole(message.role)
}

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
    !('id' in message) ||
    typeof message.id !== 'string' ||
    !message.content.trim().length
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
  return Object.values(Api).includes(api) ? api as ApiType : DEFAULT_API
}

export function getSafeModelKey(api: ApiType, model: unknown): string {
  if (typeof model === 'string' && models[api][model]) {
    return model
  }
  return getDefaultModel(api).key
}

export function getSafeSystemPrompt(model: Model, systemPrompt: unknown): string | undefined {
  if (
    typeof systemPrompt === 'string' &&
    systemPrompt.trim().length < model.maxTokens.input
  ) {
    return systemPrompt.trim()
  }
  return undefined
}

export function getSafeTemperature(model: Model, temperature: unknown): number | undefined {
  if (typeof temperature === 'number') {
    return Math.max(0, Math.min(temperature, model.maxTemperature))
  }
  return undefined
}

export function getSafeMaxTokens(model: Model, maxTokens: unknown): number | undefined {
  if (typeof maxTokens === 'number') {
    return Math.max(1, Math.min(maxTokens, model.maxTokens.output))
  }
  return undefined
}

export function getSafeStopSequences(stopSequences: unknown): string[] | undefined {
  if (Array.isArray(stopSequences)) {
    return stopSequences.filter(sequence => sequence && typeof sequence === 'string').slice(0, 4)
  }
  return undefined
}

export function getSafeError(error: unknown): string {
  return error instanceof Error ? error.message : 'An error occurred'
}
