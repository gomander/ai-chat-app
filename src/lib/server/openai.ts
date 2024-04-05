import OpenAi from 'openai'
import { encode } from 'gpt-tokenizer'
import { OPENAI_API_KEY } from '$env/static/private'
import { getDefaultModel } from '$lib/data/models'
import defaultSystemPrompt from '$lib/data/system-prompts/default'
import { Api, type ApiMessage } from '$types/common'

const openai = new OpenAi({ apiKey: OPENAI_API_KEY })

export async function generateOpenaiResponse(
  messages: ApiMessage[],
  systemPrompt = defaultSystemPrompt,
  model = getDefaultModel(Api.OPENAI).model,
  stream = true
): Promise<string | ReadableStream<Uint8Array>> {
  let tokens = getTokens(systemPrompt)
  for (const message of messages) {
    const currentMessageTokens = getTokens(message.content)
    if (currentMessageTokens > model.maxTokens.input) {
      throw new Error('Your message is too long.')
    }
    tokens += currentMessageTokens
  }
  while (tokens > model.maxTokens.input) {
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
  const config: OpenAi.Chat.Completions.ChatCompletionCreateParams = {
    model: model.id,
    messages: [{ role: 'system', content: systemPrompt }, ...messages]
  }
  if (stream) {
    return (await openai.chat.completions.create({
      ...config,
      stream: true
    })).toReadableStream()
  }
  return (await openai.chat.completions.create(
    config
  )).choices[0].message.content || 'An error occurred, please try again later.'
}

function getTokens(input: string) {
  return encode(input).length
}
