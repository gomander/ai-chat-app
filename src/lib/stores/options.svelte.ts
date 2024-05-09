import { browser } from '$app/environment'
import {
  getSafeApi, getSafeMaxTokens, getSafeModelKey, getSafeStopSequences,
  getSafeString, getSafeSystemPrompt, getSafeTemperature
} from '$lib/utils/common'
import { DEFAULT_CHAT_OPTIONS } from '$lib/data/constants'
import models, { getDefaultModel } from '$lib/data/models'
import type { Options } from '$types/common'

function getSafeOptions(data: unknown): Options {
  const options = { ...DEFAULT_CHAT_OPTIONS }
  if (!data || typeof data !== 'object') {
    return options
  }
  if ('api' in data && typeof data.api === 'string') {
    options.api = getSafeApi(data.api)
    options.model = 'model' in data
      ? getSafeModelKey(options.api, data.model)
      : getDefaultModel(options.api).key
  }
  const model = models[options.api][options.model]
  if ('systemPrompt' in data) {
    options.systemPrompt = getSafeSystemPrompt(model, data.systemPrompt)
  }
  if ('temperature' in data) {
    options.temperature = getSafeTemperature(model, data.temperature)
  }
  if ('maxTokens' in data) {
    options.maxTokens = getSafeMaxTokens(model, data.maxTokens)
  }
  if ('stopSequences' in data) {
    options.stopSequences = getSafeStopSequences(data.stopSequences)
  }
  if ('name' in data) {
    options.name = getSafeString(data.name)
  }
  return options
}

let store = $state(DEFAULT_CHAT_OPTIONS)

export default store

export function setOptions(data: Options) {
  store.api = data.api
  store.model = data.model
  store.systemPrompt = data.systemPrompt
  store.temperature = data.temperature
  store.maxTokens = data.maxTokens
  store.stopSequences = data.stopSequences
  store.name = data.name
}
