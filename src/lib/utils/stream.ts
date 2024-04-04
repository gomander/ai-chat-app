import { Api, type ApiMessage, type ApiType } from '$types/common'

const CHUNK_DELIMITER = '<new chunk>'

export async function streamResponse(
  body: ReadableStream<Uint8Array>,
  answer: ApiMessage,
  api: ApiType
) {
  const reader = body.pipeThrough(new TextDecoderStream()).getReader()
  do {
    const { done, value } = await reader.read()
    if (done) {
      break
    }
    const chunks = parseData(value)
    switch (api) {
      case Api.OPENAI:
        handleChunksOpenai(chunks, answer)
        break
      case Api.ANTHROPIC:
        handleChunksAnthropic(chunks, answer)
        break
    }
  } while (reader)
}

function parseData(data: string) {
  return data
    .replace(/}\n+?{/g, `}${CHUNK_DELIMITER}{`)
    .replace(/\n+$/, '')
    .split(CHUNK_DELIMITER)
    .map(chunk => JSON.parse(chunk))
}

function handleChunksOpenai(chunks: any, answer: ApiMessage) {
  for (const chunk of chunks) {
    const [{ delta }] = chunk.choices
    if (delta?.content) {
      answer.content += delta.content
    }
  }
}

function handleChunksAnthropic(chunks: any, answer: ApiMessage) {
  for (const chunk of chunks) {
    if (chunk.delta?.text) {
      answer.content += chunk.delta.text
    }
  }
}
