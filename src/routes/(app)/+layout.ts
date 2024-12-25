import type { ChatMeta } from '$types/common'

export const prerender = true
export const ssr = false

export function load(): { chats: ChatMeta[] } {
  const chats: ChatMeta[] = []
  try {
    chats.push(...JSON.parse(localStorage.getItem('chats') || '[]'))
  } catch (e) {
    console.error(e)
  }
  return { chats }
}
