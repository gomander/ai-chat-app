import { getDefaultModel } from '$lib/data/models'
import { Api, type ApiOptions, type ChatData } from '$types/common'

export const DEFAULT_API = Api.OPENAI
const DEFAULT_MODEL = getDefaultModel(DEFAULT_API)
export const DEFAULT_API_OPTIONS: ApiOptions = { api: DEFAULT_API, model: DEFAULT_MODEL.key, stream: true }
export const DEFAULT_DISPLAY_OPTIONS = { name: '' }
export const DEFAULT_CHAT: ChatData = {
  messages: [],
  apiOptions: DEFAULT_API_OPTIONS,
  displayOptions: DEFAULT_DISPLAY_OPTIONS
}
