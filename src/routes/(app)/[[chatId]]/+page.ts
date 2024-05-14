import { browser } from '$app/environment'
import { getNewId } from '$lib/utils/common'
import { DEFAULT_CHAT } from '$lib/data/constants'
import type { ChatData, ChatMeta } from '$types/common'
import { redirect } from '@sveltejs/kit'

export async function load({ params, parent }): Promise<{ chatId: string, chat: ChatData }> {
  const { chatId } = params
  if (browser && chatId) {
    const layoutData = await parent()
    try {
      return {
        chatId,
        chat: loadChat(chatId, layoutData.chats)
      }
    } catch (e) {
      console.error(e)
      redirect(303, '/')
    }
  }
  return {
    chatId: chatId || getNewId(),
    chat: DEFAULT_CHAT
  }
}

function loadChat(chatId: string, chats: ChatMeta[]): ChatData {
  const chatMeta = chats.find(chat => chat.id === chatId)
  if (!chatMeta) {
    throw new Error('Chat not found')
  }
  const chatMessagesString = localStorage.getItem(`chat-${chatId}`)
  if (!chatMessagesString) {
    throw new Error('Chat messages not found')
  }
  const chatMessages = JSON.parse(chatMessagesString)
  // TODO: validate chat data
  return {
    messages: chatMessages,
    apiOptions: chatMeta.apiOptions,
    displayOptions: chatMeta.displayOptions
  }
}
