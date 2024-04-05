import Anthropic from '@anthropic-ai/sdk'
import { ANTHROPIC_API_KEY } from '$env/static/private'
import { getDefaultModel } from '$lib/data/models'
import defaultSystemPrompt from '$lib/data/system-prompts/default'
import { Api, type ApiMessage } from '$types/common'

const anthropic = new Anthropic({ apiKey: ANTHROPIC_API_KEY })

export async function generateAnthropicResponse(
  messages: ApiMessage[],
  systemPrompt = defaultSystemPrompt,
  model = getDefaultModel(Api.ANTHROPIC).model,
  stream = true
): Promise<string | ReadableStream<Uint8Array>> {
  const config = {
    model: model.id,
    max_tokens: 1024,
    system: systemPrompt,
    messages
  }
  if (stream) {
    return anthropic.messages.stream(config).toReadableStream()
  }
  return (await anthropic.messages.create(config)).content[0].text
}
