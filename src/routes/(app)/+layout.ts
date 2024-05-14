import { browser } from '$app/environment'
import type { ChatMeta } from '$types/common'

export const ssr = false

export function load(): { chats: ChatMeta[] } {
  const chats: ChatMeta[] = []
  if (browser) {
    const storedChatsString = localStorage.getItem('chats')
    if (storedChatsString) {
      try {
        const storedChats = JSON.parse(storedChatsString)
        // TODO: validate stored chats
        chats.push(...storedChats)
      } catch (e) {
        console.error(e)
      }
    }
  }
  return { chats }
}
