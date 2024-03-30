import models from '$lib/data/models'
import { DEFAULT_API } from '$lib/data/constants'
import type { LoadData } from './types'

export function load(): LoadData {
  return {
    messages: [],
    api: DEFAULT_API,
    model: models[DEFAULT_API].default.name
  }
}
