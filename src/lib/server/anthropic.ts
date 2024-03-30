import Anthropic from '@anthropic-ai/sdk'
import { ANTHROPIC_API_KEY } from '$env/static/private'
import models from '$lib/data/models'
import defaultSystemPrompt from '$lib/data/system-prompts/default'
import type { Message } from '$types/common'

const anthropic = new Anthropic({ apiKey: ANTHROPIC_API_KEY })

export async function generateAnthropicResponse(
  messages: Message[],
  systemPrompt = defaultSystemPrompt,
  model = models.anthropic.default,
  stream = true
): Promise<string | ReadableStream<Uint8Array>> {
  const config = {
    model: model.name,
    max_tokens: 1024,
    system: systemPrompt,
    messages
  }
  if (stream) {
    return anthropic.messages.stream(config).toReadableStream()
  }
  return (await anthropic.messages.create(config)).content[0].text
}
