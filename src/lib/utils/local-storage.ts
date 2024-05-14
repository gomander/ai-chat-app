import { getNewId } from '$lib/utils/common'
import { DEFAULT_API_OPTIONS, DEFAULT_DISPLAY_OPTIONS } from '$lib/data/constants'
import type { ChatData, ChatMeta, Message, ApiOptions, DisplayOptions } from '$types/common'

export function loadChats(): ChatMeta[] {
  return JSON.parse(localStorage.getItem('chats') || '[]')
}

export function loadChat(id: string): ChatData {
  const chats = loadChats()
  const chat = chats.find(chat => chat.id === id)
  if (chat) {
    const messages = localStorage.getItem(`chat-${id}`)
    if (messages) {
      return {
        apiOptions: chat.apiOptions,
        displayOptions: chat.displayOptions,
        messages: JSON.parse(messages)
      }
    }
  }
  throw new Error('Chat not found')
}

export function saveChat(
  id = getNewId(),
  { messages, apiOptions, displayOptions }: Partial<ChatData>
) {
  saveChatOptions(id, { apiOptions, displayOptions })
  if (messages) {
    saveChatMessages(id, messages)
  }
  return loadChat(id)
}

export function saveChatOptions(
  id: string,
  { apiOptions, displayOptions }: {
    apiOptions?: ApiOptions,
    displayOptions?: DisplayOptions

  } = {}
) {
  const chats = loadChats()
  const chat = chats.find(chat => chat.id === id)
  if (chat) {
    if (apiOptions) {
      chat.apiOptions = apiOptions
    }
    if (displayOptions) {
      chat.displayOptions = displayOptions
    }
    chat.updatedAt = Date.now()
  } else {
    chats.push({
      id,
      apiOptions: apiOptions || DEFAULT_API_OPTIONS,
      displayOptions: displayOptions || DEFAULT_DISPLAY_OPTIONS,
      updatedAt: Date.now()
    })
  }
  localStorage.setItem('chats', JSON.stringify(chats))
}

export function saveChatMessages(id: string, messages: Message[]) {
  const chats = loadChats()
  const chat = chats.find(chat => chat.id === id)
  if (chat) {
    chat.updatedAt = Date.now()
  }
  localStorage.setItem(`chat-${id}`, JSON.stringify(messages))
}

export function deleteChat(id: string) {
  const chats = loadChats()
  const chatIndex = chats.findIndex(c => c.id === id)
  if (chatIndex !== -1) {
    chats.splice(chatIndex, 1)
    localStorage.setItem('chats', JSON.stringify(chats))
    localStorage.removeItem(`chat-${id}`)
  }
}
