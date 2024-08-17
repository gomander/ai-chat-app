import { GoogleGenerativeAI } from '@google/generative-ai'
import { GOOGLEAI_API_KEY } from '$env/static/private'
import { getDefaultModel } from '$lib/data/models'
import { Api, type ApiMessage } from '$types/common'

const googleai = new GoogleGenerativeAI(GOOGLEAI_API_KEY)

/**
 * Streaming doesn't work yet, so this function always returns Promise<string>.
 */
export async function generateGoogleaiResponse(
  messages: ApiMessage[],
  modelData = getDefaultModel(Api.GOOGLEAI).model,
  options: {
    systemPrompt?: string,
    maxTokens?: number,
    temperature?: number,
    stopSequences?: string[],
    stream?: boolean
  } = {}
): Promise<string | ReadableStream<Uint8Array>> {
  const model = googleai.getGenerativeModel({ model: modelData.id })
  const chat = model.startChat({
    systemInstruction: options.systemPrompt,
    history: [
      ...messages.map(message => ({
        role: message.role === 'user' ? 'user' : 'model',
        parts: [{ text: message.content }]
      })
      ).slice(0, messages.length - 1)
    ],
    generationConfig: {
      maxOutputTokens: options.maxTokens,
      temperature: options.temperature,
      stopSequences: options.stopSequences
    }
  })
  // GoogleAI's streaming endpoint returns an odd format that cannot easily be converted to a ReadableStream.
  // if (options.stream) {
  //   const result = await chat.sendMessageStream(messages.at(-1)?.content || '')
  //   return result.stream
  // }
  return (await chat.sendMessage(messages.at(-1)?.content || '')).response.text()
}
