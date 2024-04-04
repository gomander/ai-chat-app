import type { ApiType, Model } from '$types/common'

const models: Record<ApiType, { default: Model } & Record<string, Model>> = {
  openai: {
    default: { name: 'gpt-3.5-turbo', contextWindow: 16385 },
    'gpt-3.5-turbo': { name: 'gpt-3.5-turbo', contextWindow: 16385 },
    'gpt-4-turbo': { name: 'gpt-4-turbo-preview', contextWindow: 128000 }
  },
  anthropic: {
    default: { name: 'claude-3-haiku-20240307', contextWindow: 200000 },
    'claude-3-haiku': { name: 'claude-3-haiku-20240307', contextWindow: 200000 },
    'claude-3-sonnet': { name: 'claude-3-sonnet-20240229', contextWindow: 200000 },
    'claude-3-opus': { name: 'claude-3-opus-20240229', contextWindow: 200000 }
  }
}

export default models
