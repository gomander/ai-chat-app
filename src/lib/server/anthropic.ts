import Anthropic from '@anthropic-ai/sdk'
import { ANTHROPIC_API_KEY } from '$env/static/private'
import { getDefaultModel } from '$lib/data/models'
import { Api, type ApiMessage } from '$types/common'

const anthropic = new Anthropic({ apiKey: ANTHROPIC_API_KEY })

export async function generateAnthropicResponse(
  messages: ApiMessage[],
  model = getDefaultModel(Api.ANTHROPIC).model,
  options: {
    systemPrompt?: string,
    maxTokens?: number,
    temperature?: number,
    stopSequences?: string[]
    stream?: boolean
  } = {}
): Promise<string | ReadableStream<Uint8Array>> {
  const config: Anthropic.MessageCreateParams = {
    model: model.id,
    max_tokens: options.maxTokens || 1024,
    system: options.systemPrompt,
    messages,
    temperature: options.temperature,
    stop_sequences: options.stopSequences
  }
  if (options.stream) {
    return anthropic.messages.stream(config).toReadableStream()
  }
  return (await anthropic.messages.create(config)).content[0].text
}
