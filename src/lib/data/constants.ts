import { getDefaultModel } from '$lib/data/models'
import { Api, type Options } from '$types/common'

export const DEFAULT_API = Api.OPENAI
const DEFAULT_MODEL = getDefaultModel(DEFAULT_API)
export const DEFAULT_CHAT_OPTIONS: Options = { api: DEFAULT_API, model: DEFAULT_MODEL.key }
