import { assertMessages, assertApi, getSafeError } from '$lib/utils/common'
import { generateOpenaiResponse } from '$lib/server/openai'
import { generateAnthropicResponse } from '$lib/server/anthropic'
import models from '$lib/data/models'
import defaultSystemPrompt from '$lib/data/system-prompts/default'
import { Api, type ApiType, type Message } from '$types/common'

export async function POST({ request }) {
  const data = await request.json() as unknown
  try {
    assertData(data)
    return new Response(
      await generateResponse(
        data.messages,
        data.systemPrompt,
        data.api,
        data.model,
        data.stream
      ),
      { headers: { 'Content-Type': 'text/event-stream' } }
    )
  } catch (e) {
    console.error(e)
    return new Response(getSafeError(e))
  }
}

function assertData(data: unknown): asserts data is {
  messages: Message[],
  api: ApiType,
  model?: string,
  stream?: boolean,
  systemPrompt?: string
} {
  if (
    !data || typeof data !== 'object' ||
    !('messages' in data) ||
    !('api' in data) ||
    'stream' in data && typeof data.stream !== 'boolean' ||
    'model' in data && typeof data.model !== 'string' ||
    'systemPrompt' in data && typeof data.systemPrompt !== 'string' ||
    Object.keys(data).some(key =>
      !['messages', 'api', 'model', 'stream', 'systemPrompt'].includes(key)
    )
  ) {
    throw new Error('Invalid data')
  }
  assertMessages(data.messages)
  assertApi(data.api)
}

function generateResponse(
  messages: Message[],
  systemPrompt = defaultSystemPrompt,
  api: ApiType,
  modelName = 'default',
  stream = true
): Promise<string | ReadableStream<Uint8Array>> {
  const model = models[api][modelName]
  switch (api) {
    case Api.ANTHROPIC:
      return generateAnthropicResponse(messages, systemPrompt, model, stream)
    case Api.OPENAI:
      return generateOpenaiResponse(messages, systemPrompt, model, stream)
    default:
      throw new Error('Invalid API')
  }
}
