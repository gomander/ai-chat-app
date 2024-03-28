import openaiModels from '$lib/data/models/openai'
import { Api } from '$types/common'

export function load() {
  return {
    messages: [],
    api: Api.OPENAI,
    model: openaiModels.default.name
  }
}
