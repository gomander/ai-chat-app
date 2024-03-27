import { Role, Api, type Message } from '$types/common'

export function load(): { messages: Message[], api: Api } {
  return {
    messages: [
      { role: Role.ASSISTANT, content: 'Hello! How can I help you today?' }
    ],
    api: Api.ANTHROPIC
  }
}
