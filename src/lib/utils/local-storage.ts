import { getNewId } from '$lib/utils/common'
import type { ChatData, ChatMeta, Message, Options } from '$types/common'

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
        options: chat.options,
        messages: JSON.parse(messages)
      }
    }
  }
  throw new Error('Chat not found')
}

export function saveChat(
  id = getNewId(),
  { messages, options }: ChatData
) {
  saveChatOptions(id, options)
  saveChatMessages(id, messages)
  return loadChat(id)
}

export function saveChatOptions(id: string, options: Options) {
  const chats = loadChats()
  const chat = chats.find(chat => chat.id === id)
  if (chat) {
    chat.options = options
    chat.updatedAt = Date.now()
  } else {
    chats.push({
      id,
      options,
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
