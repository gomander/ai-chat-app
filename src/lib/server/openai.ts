import OpenAi from 'openai'
import { encode } from 'gpt-tokenizer'
import { OPENAI_API_KEY } from '$env/static/private'
import defaultSystemPrompt from '$lib/data/system-prompts/default'
import models from '$lib/data/models/openai'
import type { Message } from '$types/common'

const openai = new OpenAi({ apiKey: OPENAI_API_KEY })

export async function generateOpenaiResponse(
  messages: Message[],
  systemPrompt = defaultSystemPrompt,
  model = models['gpt-3.5-turbo']
): Promise<string | ReadableStream<Uint8Array>> {
  let tokens = getTokens(systemPrompt)
  for (const message of messages) {
    const currentMessageTokens = getTokens(message.content)
    if (currentMessageTokens > model.contextWindow) {
      throw new Error('Your message is too long. Please shorten it and try again.')
    }
    tokens += currentMessageTokens
  }
  while (tokens > model.contextWindow) {
    tokens -= getTokens(messages[0].content)
    messages.shift()
  }
  const moderationResponse = await openai.moderations.create({
    model: 'text-moderation-stable',
    input: messages.at(-1)?.content || ''
  })
  if (moderationResponse.results[0].flagged) {
    return 'Your message contains inappropriate content. Please remove it and try again.'
  }
  const stream = openai.beta.chat.completions.stream({
    model: model.name,
    messages: [
      { role: 'system', content: systemPrompt },
      ...messages
    ],
    stream: true
  })
  return stream.toReadableStream()
}

export function getTokens(input: string) {
  return encode(input).length
}
