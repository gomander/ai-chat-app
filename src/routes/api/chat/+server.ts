import { assertMessages, assertApi, getSafeError } from '$lib/utils/common'
import { generateOpenaiResponse } from '$lib/server/openai'
import { generateAnthropicResponse } from '$lib/server/anthropic'
import models from '$lib/data/models'
import systemPrompt from '$lib/data/system-prompts/default'
import { Api, type ApiType, type Message } from '$types/common'

export async function POST({ request }) {
  const data = await request.json() as unknown
  try {
    assertData(data)
    const message = await generateResponse(
      data.messages, systemPrompt, data.api, data.model, data.stream
    )
    return new Response(message, {
      headers: { 'Content-Type': 'text/event-stream' }
    })
  } catch (e) {
    console.error(e)
    return new Response(getSafeError(e))
  }
}

function assertData(data: unknown): asserts data is {
  messages: Message[],
  api: ApiType,
  model?: string,
  stream?: boolean
} {
  if (
    !data || typeof data !== 'object' ||
    !('messages' in data) ||
    !('api' in data) ||
    'stream' in data && typeof data.stream !== 'boolean' ||
    'model' in data && typeof data.model !== 'string' ||
    Object.keys(data).some(key => !['messages', 'api', 'model', 'stream'].includes(key))
  ) {
    throw new Error('Invalid data')
  }
  assertMessages(data.messages)
  assertApi(data.api)
}

function generateResponse(
  messages: Message[],
  systemPrompt: string,
  api: ApiType,
  modelName?: string,
  stream = true
): Promise<string | ReadableStream<Uint8Array>> {
  const model = modelName && models[api]?.[modelName] || models[api]?.default
  switch (api) {
    case Api.ANTHROPIC:
      return generateAnthropicResponse(messages, systemPrompt, model, stream)
    case Api.OPENAI:
      return generateOpenaiResponse(messages, systemPrompt, model, stream)
    default:
      throw new Error('Invalid API')
  }
}
