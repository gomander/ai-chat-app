export interface ApiMessage {
  role: RoleType
  content: string
}

export interface Message extends ApiMessage {
  id: string
}

export type RoleType = `${Role}`

export enum Role {
  ASSISTANT = 'assistant',
  USER = 'user'
}

export type ApiType = `${Api}`

export enum Api {
  ANTHROPIC = 'anthropic',
  OPENAI = 'openai'
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
