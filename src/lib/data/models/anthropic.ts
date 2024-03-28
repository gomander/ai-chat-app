import type { Model } from '$types/common'

const models: Record<string, Model> = {
  'claude-3-haiku-20240307': { name: 'claude-3-haiku-20240307', contextWindow: 200000 },
  'claude-3-sonnet-20240229': { name: 'claude-3-sonnet-20240229', contextWindow: 200000 },
  'claude-3-opus-20240229': { name: 'claude-3-opus-20240229', contextWindow: 200000 }
}

export default models
