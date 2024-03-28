import type { ActionResult } from '@sveltejs/kit'

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

export interface ApiResponseSuccess<T> {
  success: true
  data: T
}

export interface ApiResponseError {
  success: false
  error: string
}

export type ApiResponse<T> = ApiResponseSuccess<T> | ApiResponseError

export interface FormSubmitEvent extends SubmitEvent {
  currentTarget: EventTarget & HTMLFormElement
}
