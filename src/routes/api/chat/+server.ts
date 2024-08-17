import {
  assertApiMessages, getSafeApi, getSafeError, getSafeMaxTokens, getSafeModelKey,
  getSafeStopSequences, getSafeSystemPrompt, getSafeTemperature
} from '$lib/utils/common'
import { generateOpenaiResponse } from '$lib/server/openai'
import { generateAnthropicResponse } from '$lib/server/anthropic'
import { generateGoogleaiResponse } from '$lib/server/googleai'
import models, { getDefaultModel } from '$lib/data/models'
import { DEFAULT_API } from '$lib/data/constants'
import { Api, type ApiMessage, type ApiType, type Model } from '$types/common'

export async function POST({ request }) {
  const reqData = await request.json() as unknown
  try {
    const data = getSafeData(reqData)
    return new Response(
      await generateResponse(
        data.messages,
        data.api,
        models[data.api][data.model],
        {
          systemPrompt: data.systemPrompt,
          maxTokens: data.maxTokens,
          temperature: data.temperature,
          stopSequences: data.stopSequences,
          stream: data.stream
        }
      ),
      { headers: { 'Content-Type': 'text/event-stream' } }
    )
  } catch (e) {
    console.error(e)
    return new Response(getSafeError(e))
  }
}

function getSafeData(data: unknown): {
  messages: ApiMessage[],
  api: ApiType,
  model: string,
  systemPrompt?: string,
  maxTokens?: number,
  temperature?: number,
  stopSequences?: string[],
  stream?: boolean
} {
  if (!data || typeof data !== 'object' || !('messages' in data)) {
    throw new Error('Invalid data')
  }
  assertApiMessages(data.messages)
  const api = 'api' in data
    ? getSafeApi(data.api)
    : DEFAULT_API
  const modelKey = 'model' in data
    ? getSafeModelKey(api, data.model)
    : getDefaultModel(api).key
  const model = models[api][modelKey]
  const systemPrompt = 'systemPrompt' in data && getSafeSystemPrompt(
    model, data.systemPrompt
  ) || undefined
  const maxTokens = 'maxTokens' in data && getSafeMaxTokens(model, data.maxTokens) || undefined
  const temperature = 'temperature' in data && getSafeTemperature(
    model, data.temperature
  ) || undefined
  const stopSequences = 'stopSequences' in data && getSafeStopSequences(
    data.stopSequences
  ) || undefined
  const stream = 'stream' in data && typeof data.stream === 'boolean'
    ? data.stream
    : undefined
  return {
    messages: data.messages,
    api,
    model: modelKey,
    systemPrompt,
    maxTokens,
    temperature,
    stopSequences,
    stream
  }
}

function generateResponse(
  messages: ApiMessage[],
  api: ApiType,
  model: Model,
  options: {
    systemPrompt?: string,
    maxTokens?: number,
    temperature?: number,
    stopSequences?: string[],
    stream?: boolean
  } = {}
): Promise<string | ReadableStream<Uint8Array>> {
  switch (api) {
    case Api.ANTHROPIC:
      return generateAnthropicResponse(messages, model, options)
    case Api.OPENAI:
      return generateOpenaiResponse(messages, model, options)
    case Api.GOOGLEAI:
      return generateGoogleaiResponse(messages, model, options)
    default:
      throw new Error('Invalid API')
  }
}
