import { assertApiMessages, assertApi, getSafeError } from '$lib/utils/common'
import { generateOpenaiResponse } from '$lib/server/openai'
import { generateAnthropicResponse } from '$lib/server/anthropic'
import models, { getDefaultModel } from '$lib/data/models'
import defaultSystemPrompt from '$lib/data/system-prompts/default'
import { Api, type ApiMessage, type ApiType } from '$types/common'

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
  messages: ApiMessage[],
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
  assertApiMessages(data.messages)
  assertApi(data.api)
}

function generateResponse(
  messages: ApiMessage[],
  systemPrompt = defaultSystemPrompt,
  api: ApiType,
  modelKey = getDefaultModel(api).key,
  stream = true
): Promise<string | ReadableStream<Uint8Array>> {
  const model = models[api][modelKey]
  switch (api) {
    case Api.ANTHROPIC:
      return generateAnthropicResponse(messages, systemPrompt, model, stream)
    case Api.OPENAI:
      return generateOpenaiResponse(messages, systemPrompt, model, stream)
    default:
      throw new Error('Invalid API')
  }
}
