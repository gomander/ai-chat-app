import { GoogleGenerativeAI } from '@google/generative-ai' // needs to be installed
import { GOOGLEAI_API_KEY } from '$env/static/private'
import { getDefaultModel } from '$lib/data/models'
import defaultSystemPrompt from '$lib/data/system-prompts/default'
import { Api, type ApiMessage } from '$types/common'

const googleai = new GoogleGenerativeAI(GOOGLEAI_API_KEY)

/**
 * In theory, this should work, but I have not tested it, as the API is so
 * different from the others.
 */
export async function generateGoogleaiResponse(
  messages: ApiMessage[],
  systemPrompt = defaultSystemPrompt,
  modelData = getDefaultModel(Api.GOOGLEAI).model,
  stream = true
): Promise<string | ReadableStream> {
  const model = googleai.getGenerativeModel({ model: modelData.id })
  const chat = model.startChat({
    history: [
      { role: 'user', parts: [{ text: systemPrompt }] },
      { role: 'model', parts: [{ text: 'Understood.' }] },
      ...messages.map(message => ({
        role: message.role === 'user' ? 'user' : 'model',
        parts: [{ text: message.content }]
      })
      ).slice(0, messages.length - 1)
    ]
  })
  if (stream) {
    // ReadableStream.from was added with the experimental flag in Node 20.6.0.
    // Since this runs in the backend, we can ignore the TS error so long as the
    // environment uses Node 20.6.0 or higher.
    // @ts-expect-error
    const from = ReadableStream.from as <T>(iter: Iterable<T> | AsyncIterable<T>) => ReadableStream
    return from((await chat.sendMessageStream(messages.at(-1)?.content || '')).stream)
  }
  return (await chat.sendMessage(messages.at(-1)?.content || '')).response.text()
}
