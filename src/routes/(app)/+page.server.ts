import { assertMessages, getSafeApi } from '$lib/utils/common'
import { Role, Api, type Message, type ApiType } from '$types/common'

export const actions = {
  default: async ({ request, fetch }): Promise<{
    messages: Message[],
    api: ApiType
  }> => {
    const formData = await request.formData()
    const newMessage = String(formData.get('newMessage') || '').trim()
    const api = getSafeApi(formData.get('api'))
    try {
      const oldMessages = JSON.parse(String(formData.get('oldMessages') || '[]'))
      assertMessages(oldMessages)
      const messages: Message[] = [
        ...oldMessages,
        { role: Role.USER, content: newMessage }
      ]
      const response = await fetch('/api/chat/generate-response', {
        method: 'POST',
        body: JSON.stringify({ messages, api, stream: false })
      })
      if (!response.ok) {
        throw new Error('Failed to generate response')
      }
      messages.push({ role: Role.ASSISTANT, content: await response.text() })
      return { messages, api }
    } catch (e) {
      return {
        messages: [
          { role: Role.USER, content: newMessage },
          { role: Role.ASSISTANT, content: 'Something went wrong! Please try again later.' }
        ],
        api: Api.ANTHROPIC
      }
    }
  }
}
