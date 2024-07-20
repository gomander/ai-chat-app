import type { ChatMeta } from '$types/common'

class ChatsStore {
  chats: ChatMeta[] = $state([])
}

export default new ChatsStore()
