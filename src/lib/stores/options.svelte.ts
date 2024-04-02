import { browser } from '$app/environment'
import { assertApi } from '$lib/utils/common'
import { DEFAULT_API } from '$lib/data/constants'
import models from '$lib/data/models'
import defaultSystemPrompt from '$lib/data/system-prompts/default'
import type { ApiType } from '$types/common'

const defaultOptions = {
  api: DEFAULT_API,
  model: 'default',
  systemPrompt: defaultSystemPrompt
}

function loadFromLocalStorage() {
  if (browser) {
    const localOptions = localStorage.getItem('options')
    if (localOptions) {
      try {
        const parsedOptions = JSON.parse(localOptions)
        assertOptions(parsedOptions)
        return parsedOptions
      } catch (e) {}
    }
  }
  return defaultOptions
}

function assertOptions(options: any): asserts options is typeof defaultOptions {
  if (!options || typeof options !== 'object') {
    throw new Error('Invalid options')
  }
  const api: ApiType = options.api
  assertApi(options.api)
  if (typeof options.model !== 'string' || !models[api][options.model]) {
    throw new Error('Invalid model')
  }
}

let options = $state<{
  api: ApiType,
  model: string,
  systemPrompt: string
}>(loadFromLocalStorage())

export default options

export function saveToLocalStorage() {
  if (browser) {
    localStorage.setItem('options', JSON.stringify(options))
  }
}
