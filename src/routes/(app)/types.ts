import type { ApiType, Message } from '$types/common'

export interface LoadData {
  messages: Message[],
  api: ApiType,
  model: string
}
