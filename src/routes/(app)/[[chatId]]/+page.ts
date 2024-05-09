import { getNewId } from '$lib/utils/common'
import { loadChat } from '$lib/utils/local-storage'
import { DEFAULT_CHAT_OPTIONS } from '$lib/data/constants'
import type { ChatData } from '$types/common'

export function load({ params }): { chatId: string, chat: ChatData } {
  const chatId = params.chatId || getNewId()
  try {
    return {
      chatId,
      chat: loadChat(chatId)
    }
  } catch (error) {
    return {
      chatId,
      chat: { messages: [], options: DEFAULT_CHAT_OPTIONS }
    }
  }
}
