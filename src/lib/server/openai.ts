import OpenAi from 'openai'
import { encode } from 'gpt-tokenizer'
import { OPENAI_API_KEY } from '$env/static/private'
import { getDefaultModel } from '$lib/data/models'
import { Api, type ApiMessage } from '$types/common'

const openai = new OpenAi({ apiKey: OPENAI_API_KEY })

export async function generateOpenaiResponse(
  messages: ApiMessage[],
  model = getDefaultModel(Api.OPENAI).model,
  options: {
    systemPrompt?: string,
    maxTokens?: number,
    temperature?: number,
    stopSequences?: string[],
    stream?: boolean
  } = {}
): Promise<string | ReadableStream<Uint8Array>> {
  let tokens = getTokens(options.systemPrompt || '')
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
    messages: options.systemPrompt
      ? [{ role: 'system', content: options.systemPrompt }, ...messages]
      : messages,
    max_tokens: options.maxTokens,
    temperature: options.temperature,
    stop: options.stopSequences
  }
  if (options.stream) {
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
