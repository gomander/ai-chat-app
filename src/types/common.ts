export interface ApiMessage {
  role: RoleType
  content: string
}

export interface Message extends ApiMessage {
  id: string
}

export interface ApiOptions {
  api: ApiType,
  model: string,
  systemPrompt?: string,
  temperature?: number,
  maxTokens?: number,
  stopSequences?: string[],
  stream?: boolean
}

export interface DisplayOptions {
  name: string
}

export interface ChatData {
  messages: Message[]
  apiOptions: ApiOptions
  displayOptions: DisplayOptions
}

export interface ChatMeta {
  id: string
  apiOptions: ApiOptions
  displayOptions: DisplayOptions
  updatedAt: number
}

export type RoleType = `${Role}`

export enum Role {
  ASSISTANT = 'assistant',
  USER = 'user'
}

export type ApiType = `${Api}`

export enum Api {
  ANTHROPIC = 'anthropic',
  OPENAI = 'openai',
  GOOGLEAI = 'googleai'
}

export interface Model {
  id: string
  name: string
  maxTokens: {
    input: number
    output: number
  }
  maxTemperature: number
}

export interface FormSubmitEvent extends SubmitEvent {
  currentTarget: EventTarget & HTMLFormElement
}
