import { Api, type Message, type ApiType } from '$types/common'

export function load(): { messages: Message[], api: ApiType } {
  return {
    messages: [],
    api: Api.OPENAI
  }
}
