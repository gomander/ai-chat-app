import models from '$lib/data/models'
import { Api } from '$types/common'
import type { LoadData } from './types'

export function load(): LoadData {
  return {
    messages: [],
    api: Api.OPENAI,
    model: models.openai.default.name
  }
}
