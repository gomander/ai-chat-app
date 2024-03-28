import { assertMessages, assertApi, getSafeError } from '$lib/utils/common'
import { generateOpenaiResponse } from '$lib/server/openai'
import { generateAnthropicResponse } from '$lib/server/anthropic'
import systemPrompt from '$lib/data/system-prompts/default'
import { Api, type ApiType, type Message } from '$types/common'

export async function POST({ request }) {
  const data = await request.json() as unknown
  try {
    assertData(data)
    const message = await generateResponse(data.messages, systemPrompt, data.api)
    return new Response(message, {
      headers: {
        'Content-Type': 'text/event-stream'
      }
    })
  } catch (e) {
    console.error(e)
    return new Response(JSON.stringify({
      success: false,
      error: getSafeError(e)
    }))
  }
}

function assertData(data: unknown): asserts data is { messages: Message[], api: ApiType } {
  if (!data || typeof data !== 'object' || !('messages' in data) || !('api' in data)) {
    throw new Error('Invalid data')
  }
  assertMessages(data.messages)
  assertApi(data.api)
}

function generateResponse(
  messages: Message[],
  systemPrompt: string,
  api: ApiType
): Promise<string | ReadableStream<Uint8Array>> {
  switch (api) {
    case Api.ANTHROPIC:
      return generateAnthropicResponse(messages, systemPrompt)
    case Api.OPENAI:
      return generateOpenaiResponse(messages, systemPrompt)
    default:
      throw new Error('Invalid API')
  }
}
