import { DEFAULT_CHAT } from '$lib/data/constants'
import type { ChatData } from '$types/common'

class ChatStore {
  chat: ChatData = $state(DEFAULT_CHAT)
  id: string = $state(crypto.randomUUID())
}

export default new ChatStore()
