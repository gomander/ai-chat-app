import { assertMessages, assertApi, getSafeError } from '$lib/utils/common'
import { generateOpenaiResponse } from '$lib/server/openai'
import { generateAnthropicResponse } from '$lib/server/anthropic'
import systemPrompt from '$lib/data/system-prompts/default'
import openaiModels from '$lib/data/models/openai'
import anthropicModels from '$lib/data/models/anthropic'
import { Api, type ApiType, type Message } from '$types/common'

export async function POST({ request }) {
  const data = await request.json() as unknown
  try {
    assertData(data)
    const message = await generateResponse(
      data.messages, systemPrompt, data.api, data.stream
    )
    return new Response(message, {
      headers: { 'Content-Type': 'text/event-stream' }
    })
  } catch (e) {
    console.error(e)
    return new Response(JSON.stringify({
      success: false,
      error: getSafeError(e)
    }))
  }
}

function assertData(data: unknown): asserts data is {
  messages: Message[],
  api: ApiType,
  stream?: boolean
} {
  if (
    !data ||
    typeof data !== 'object' ||
    !('messages' in data) ||
    !('api' in data) ||
    ('stream' in data && typeof data.stream !== 'boolean') ||
    ![2, 3, 4].includes(Object.keys(data).length)
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
  stream = true
): Promise<string | ReadableStream<Uint8Array>> {
  switch (api) {
    case Api.ANTHROPIC:
      return generateAnthropicResponse(
        messages,
        systemPrompt,
        anthropicModels['claude-3-haiku-20240307'],
        stream
      )
    case Api.OPENAI:
      return generateOpenaiResponse(
        messages,
        systemPrompt,
        openaiModels['gpt-3.5-turbo'],
        stream
      )
    default:
      throw new Error('Invalid API')
  }
}
