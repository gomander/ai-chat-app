import type { ApiType, Model } from '$types/common'

const openaiModels: Record<string, Model> = {
  'gpt-4o-mini': {
    name: 'GPT-4o mini',
    id: 'gpt-4o-mini',
    maxTokens: {
      input: 128000,
      output: 4096
    },
    maxTemperature: 2
  },
  'gpt-4o': {
    name: 'GPT-4o',
    id: 'gpt-4o',
    maxTokens: {
      input: 128000,
      output: 4096
    },
    maxTemperature: 2
  }
}

const anthropicModels: Record<string, Model> = {
  'claude-3-haiku': {
    name: 'Claude 3 Haiku',
    id: 'claude-3-haiku-20240307',
    maxTokens: {
      input: 200000,
      output: 4096
    },
    maxTemperature: 1
  },
  'claude-3-sonnet': {
    name: 'Claude 3 Sonnet',
    id: 'claude-3-sonnet-20240229',
    maxTokens: {
      input: 200000,
      output: 4096
    },
    maxTemperature: 1
  },
  'claude-3-opus': {
    name: 'Claude 3 Opus',
    id: 'claude-3-opus-20240229',
    maxTokens: {
      input: 200000,
      output: 4096
    },
    maxTemperature: 1
  }
}

const googleaiModels: Record<string, Model> = {
  'gemini-1.5-flash': {
    name: 'Gemini 1.5 Flash',
    id: 'gemini-1.5-flash',
    maxTokens: {
      input: 1048576,
      output: 8192
    },
    maxTemperature: 1
  },
  'gemini-1.5-pro': {
    name: 'Gemini 1.5 Pro',
    id: 'gemini-1.5-pro',
    maxTokens: {
      input: 2097152,
      output: 8192
    },
    maxTemperature: 1
  }
}

const models: Record<ApiType, Record<string, Model>> = {
  openai: openaiModels,
  anthropic: anthropicModels,
  googleai: googleaiModels
}

export function getDefaultModel(api: ApiType): { key: string, model: Model } {
  return {
    key: Object.keys(models[api])[0],
    model: Object.values(models[api])[0]
  }
}

export default models
