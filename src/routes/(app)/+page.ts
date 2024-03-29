import openaiModels from '$lib/data/models/openai'
import { Api, type ApiType, type Message } from '$types/common'
import type { LoadData } from './types'

export function load(): LoadData {
  return {
    messages: [],
    api: Api.OPENAI,
    model: openaiModels.default.name
  }
}
