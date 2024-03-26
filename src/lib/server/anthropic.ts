import anthropicClient from '@anthropic-ai/sdk'
import { ANTHROPIC_API_KEY } from '$env/static/private'
import defaultSystemPrompt from '$lib/data/system-prompts/default'
import { Role, type Message } from '$types/common'

const anthropic = new anthropicClient({ apiKey: ANTHROPIC_API_KEY })

export async function generateAnthropicResponse(
  messages: Message[],
  systemPrompt = defaultSystemPrompt,
  model = 'claude-3-haiku-20240307'
): Promise<string> {
  const response = await anthropic.messages.create({
    model,
    max_tokens: 256,
    system: systemPrompt,
    messages: [
      { role: Role.USER, content: 'Hello' },
      ...messages
    ]
  })
  return response.content[0].text
}
