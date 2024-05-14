import { browser } from '$app/environment'
import { getNewId } from '$lib/utils/common'
import { DEFAULT_API_OPTIONS, DEFAULT_CHAT, DEFAULT_DISPLAY_OPTIONS } from '$lib/data/constants'
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
  const chatMeta = chats.find(chat => chat.id === chatId) || DEFAULT_CHAT
  const chatMessagesString = localStorage.getItem(`chat-${chatId}`) || '[]'
  const chatMessages = JSON.parse(chatMessagesString)
  // TODO: validate chat data
  return {
    messages: chatMessages,
    apiOptions: chatMeta.apiOptions,
    displayOptions: chatMeta.displayOptions
  }
}
