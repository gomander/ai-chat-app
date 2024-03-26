import OpenAiClient from 'openai'
import { OPENAI_API_KEY } from '$env/static/private'
import defaultSystemPrompt from '$lib/data/system-prompts/default'
import type { Message } from '$types/common'

const openai = new OpenAiClient({ apiKey: OPENAI_API_KEY })

export async function generateOpenaiResponse(
  messages: Message[],
  systemPrompt = defaultSystemPrompt,
  model = 'gpt-3.5-turbo'
): Promise<string> {
  const response = await openai.chat.completions.create({
    model,
    messages: [
      { role: 'system', content: systemPrompt },
      ...messages
    ]
  })
  return response.choices[0].message.content || 'An error occurred. Please try again later.'
}
