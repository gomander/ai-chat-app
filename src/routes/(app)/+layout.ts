import { loadChats } from '$lib/utils/local-storage'
import type { ChatMeta } from '$types/common'

export const prerender = true
export const ssr = false

export function load(): { chats: ChatMeta[] } {
  return {
    chats: loadChats()
  }
}
