import { browser } from '$app/environment'
import {
  getSafeApi, getSafeMaxTokens, getSafeModelKey, getSafeStopSequences,
  getSafeSystemPrompt, getSafeTemperature
} from '$lib/utils/common'
import { DEFAULT_API } from '$lib/data/constants'
import models, { getDefaultModel } from '$lib/data/models'
import type { ApiType } from '$types/common'

interface Options {
  api: ApiType,
  model: string,
  systemPrompt?: string,
  temperature?: number,
  maxTokens?: number,
  stopSequences?: string[]
}

const defaultOptions: Options = {
  api: DEFAULT_API,
  model: getDefaultModel(DEFAULT_API).key
}

function loadFromLocalStorage() {
  if (browser) {
    const localOptions = localStorage.getItem('options')
    if (localOptions) {
      try {
        const parsedOptions = JSON.parse(localOptions)
        return getSafeOptions(parsedOptions)
      } catch (e) {}
    }
  }
  return { ...defaultOptions }
}

function getSafeOptions(data: unknown): Options {
  const options = { ...defaultOptions }
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
  return options
}

let options = $state<Options>(loadFromLocalStorage())

export default options

export function saveToLocalStorage() {
  if (browser) {
    localStorage.setItem('options', JSON.stringify(options))
  }
}
