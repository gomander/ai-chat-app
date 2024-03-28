import type { Model } from '$types/common'

const models = {
  default: { name: 'claude-3-haiku-20240307', contextWindow: 200000 },
  'claude-3-haiku-20240307': { name: 'claude-3-haiku-20240307', contextWindow: 200000 },
  'claude-3-sonnet-20240229': { name: 'claude-3-sonnet-20240229', contextWindow: 200000 },
  'claude-3-opus-20240229': { name: 'claude-3-opus-20240229', contextWindow: 200000 }
} as const satisfies Record<string, Model>

export default models
