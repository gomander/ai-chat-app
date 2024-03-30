import models from '$lib/data/models'
import { assertMessages, getSafeApi } from '$lib/utils/common'
import { DEFAULT_API } from '$lib/data/constants'
import { Role, type Message } from '$types/common'
import type { LoadData } from './types'

export const actions = {
  default: async ({ request, fetch }): Promise<LoadData> => {
    const formData = await request.formData()
    const newMessage = String(formData.get('newMessage') || '').trim()
    const api = getSafeApi(formData.get('api'))
    const model = (models[api][String(formData.get('model'))] || models[api].default).name
    try {
      const oldMessages = JSON.parse(String(formData.get('oldMessages') || '[]'))
      assertMessages(oldMessages)
      const messages: Message[] = [
        ...oldMessages, { role: Role.USER, content: newMessage }
      ]
      const response = await fetch('/api/chat', {
        method: 'POST',
        body: JSON.stringify({ messages, api, stream: false })
      })
      if (!response.ok) {
        throw new Error('Failed to generate response')
      }
      messages.push({ role: Role.ASSISTANT, content: await response.text() })
      return { messages, api, model }
    } catch (e) {
      return {
        messages: [
          { role: Role.USER, content: newMessage },
          { role: Role.ASSISTANT, content: 'Something went wrong! Please try again later.' }
        ],
        api: DEFAULT_API,
        model
      }
    }
  }
}
