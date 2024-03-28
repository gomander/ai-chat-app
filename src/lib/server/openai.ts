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
  model = models['gpt-3.5-turbo'],
  stream = true
): Promise<string | ReadableStream<Uint8Array>> {
  let tokens = getTokens(systemPrompt)
  for (const message of messages) {
    const currentMessageTokens = getTokens(message.content)
    if (currentMessageTokens > model.contextWindow) {
      throw new Error('Your message is too long.')
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
    return 'Your message contains inappropriate content.'
  }
  if (stream) {
    return streamChatCompletion(messages, systemPrompt, model.name)
  }
  return getChatCompletion(messages, systemPrompt, model.name)
}

function getTokens(input: string) {
  return encode(input).length
}

async function getChatCompletion(
  messages: Message[],
  systemPrompt: string,
  model: string
) {
  return (await openai.chat.completions.create({
    model,
    messages: [
      { role: 'system', content: systemPrompt },
      ...messages
    ]
  })).choices[0].message.content || 'An error occurred, please try again later.'
}

async function streamChatCompletion(
  messages: Message[],
  systemPrompt: string,
  model: string
) {
  return (await openai.chat.completions.create({
    model,
    messages: [
      { role: 'system', content: systemPrompt },
      ...messages
    ],
    stream: true
  })).toReadableStream()
}
