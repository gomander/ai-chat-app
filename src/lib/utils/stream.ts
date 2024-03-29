import type { Message } from '$types/common'

const CHUNK_DELIMITER = '<new chunk>'

export async function streamResponse(body: ReadableStream<Uint8Array>, answer: Message) {
  const reader = body?.pipeThrough(new TextDecoderStream()).getReader()
  while (reader) {
    const { done, value } = await reader.read()
    if (done) {
      break
    }
    handleChunks(value, answer)
  }
}

function handleChunks(value: string, answer: Message) {
  const chunks = value.replace(
    /}]}(.|\n)+?{/g, `}]}${CHUNK_DELIMITER}{`
  ).replace(/\n$/, '').split(CHUNK_DELIMITER).map(
    chunk => JSON.parse(chunk)
  )
  for (const chunk of chunks) {
    const [{ delta }] = chunk.choices
    if (delta?.content) {
      answer.content += delta.content
    }
  }
}
