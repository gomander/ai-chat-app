export interface Message {
  role: RoleType
  content: string
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
  name: string
  contextWindow: number
}

export interface FormSubmitEvent extends SubmitEvent {
  currentTarget: EventTarget & HTMLFormElement
}
