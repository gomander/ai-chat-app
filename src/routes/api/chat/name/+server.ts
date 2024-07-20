import { getDefaultModel } from '$lib/data/models'
import { generateOpenaiResponse } from '$lib/server/openai'
import { assertApiMessages, getSafeError } from '$lib/utils/common'
import { Api, Role, type ApiMessage } from '$types/common'

export async function POST({ request }) {
  const reqData = await request.json() as unknown
  try {
    const { messages, systemPrompt: userSystemPrompt } = getSafeData(reqData)
    const content = (
      systemPrompt ? `The user's given system prompt is """${userSystemPrompt}"""\n\n` : ''
    ) + messages.map(message => `${message.role}: ${message.content}`).join('\n')
    const response = await generateOpenaiResponse(
      [{ role: Role.USER, content }],
      getDefaultModel(Api.OPENAI).model,
      { stream: false, maxTokens: 25, systemPrompt }
    )
    return new Response(JSON.stringify({ name: response }))
  } catch (e) {
    console.error(e)
    return new Response(getSafeError(e))
  }
}

function getSafeData(data: unknown): { messages: ApiMessage[], systemPrompt?: string } {
  if (!data || typeof data !== 'object' || !('messages' in data)) {
    throw new Error('Invalid data')
  }
  assertApiMessages(data.messages)
  if ('systemPrompt' in data && typeof data.systemPrompt === 'string') {
    return { messages: data.messages, systemPrompt: data.systemPrompt }
  }
  return { messages: data.messages }
}

const systemPrompt = 'You will be provided with the message history of a chat, as well as the user-provided system prompt for that chat (if available). Give the chat a short (2-4 words) but descriptive name.'
