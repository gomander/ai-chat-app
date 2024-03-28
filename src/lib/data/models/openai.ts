import type { Model } from '$types/common'

const models: Record<string, Model> = {
  'gpt-3.5-turbo': { name: 'gpt-3.5-turbo', contextWindow: 16385 },
  'gpt-4-turbo': { name: 'gpt-4-turbo', contextWindow: 128000 }
}

export default models
