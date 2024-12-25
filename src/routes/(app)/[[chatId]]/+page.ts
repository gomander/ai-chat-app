import { getNewId } from '$lib/utils/common'
import { DEFAULT_CHAT } from '$lib/data/constants'
import type { ChatData, ChatMeta } from '$types/common'
import { redirect } from '@sveltejs/kit'

export async function load({ params, parent }): Promise<{ chatId: string, chat: ChatData }> {
  const chatId = params.chatId || getNewId()
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

function loadChat(chatId: string, chats: ChatMeta[]): ChatData {
  const {
    apiOptions, displayOptions
  } = chats.find(chat => chat.id === chatId) || DEFAULT_CHAT
  return {
    messages: JSON.parse(localStorage.getItem(`chat-${chatId}`) || '[]'),
    apiOptions,
    displayOptions
  }
}
