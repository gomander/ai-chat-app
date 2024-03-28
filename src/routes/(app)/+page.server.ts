import { assertApi, assertMessages } from '$lib/utils/common'
import { Role, Api, type ApiResponse, type Message, type ApiType } from '$types/common'

export const actions = {
  default: async ({ request, fetch }): Promise<{
    messages: Message[],
    api: ApiType,
    stream?: ReadableStream<Uint8Array>
  }> => {
    const formData = await request.formData()
    const newMessage = String(formData.get('newMessage') || '').trim()
    const api = formData.get('api') || Api.ANTHROPIC
    const js = Boolean(formData.get('js'))
    try {
      assertApi(api)
      const oldMessages = JSON.parse(String(formData.get('oldMessages') || '[]'))
      assertMessages(oldMessages)
      const messages: Message[] = [
        ...oldMessages,
        { role: Role.USER, content: newMessage }
      ]
      const response = await fetch(
        '/api/chat/generate-response',
        {
          method: 'POST',
          body: JSON.stringify({ messages, api })
        }
      )
      if (!response.ok) {
        throw new Error('Failed to generate response')
      }
      if (!js) {
        return {
          messages: [
            ...messages,
            { role: Role.ASSISTANT, content: await response.text() }
          ],
          api
        }
      }
      return {
        messages,
        api,
        stream: response.body ?? undefined
      }
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
