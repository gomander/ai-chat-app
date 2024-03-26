import { assertMessages, assertApi, getSafeError } from '$lib/utils/common'
import { generateOpenaiResponse } from '$lib/server/openai'
import { generateAnthropicResponse } from '$lib/server/anthropic'
import systemPrompt from '$lib/data/system-prompts/default'
import { Api, type ApiType, type Message } from '$types/common'

export async function POST({ request }) {
  const data = await request.json() as unknown
  try {
    assertData(data)
    const response = data.api === Api.ANTHROPIC
      ? await generateAnthropicResponse(data.messages, systemPrompt)
      : await generateOpenaiResponse(data.messages, systemPrompt)
    return new Response(JSON.stringify({
      success: true,
      data: { message: response }
    }))
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
