import { browser } from '$app/environment'
import type { ChatMeta } from '$types/common'

export const ssr = false

export function load(): { chats: ChatMeta[] } {
  const chats: ChatMeta[] = []
  if (browser) {
    try {
      chats.push(...JSON.parse(localStorage.getItem('chats') || '[]'))
    } catch (e) {
      console.error(e)
    }
  }
  return { chats }
}
