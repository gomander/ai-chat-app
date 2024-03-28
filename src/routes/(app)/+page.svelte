<script lang="ts">
  import { onMount } from 'svelte'
  import { browser } from '$app/environment'
  import Message from '$lib/components/Message.svelte'
  import { assertMessages } from '$lib/utils/common'
  import type { FormSubmitEvent } from '$types/common'

  let { data, form } = $props()
  let messages = $state(form?.messages || data.messages)
  let api = $derived(form?.api || data.api)
  let model = $derived(form?.model || data.model)
  let loading = $state(false)
  let answer = $state('')
  let scrollToDiv: HTMLDivElement

  onMount(() => {
    if (browser) {
      try {
        const storedMessages = JSON.parse(localStorage.getItem('messages') || '[]')
        assertMessages(storedMessages)
        messages = storedMessages
      } catch (e) {}
    }
  })

  $effect(() => {
    if (browser && messages.length) {
      localStorage.setItem('messages', JSON.stringify(messages))
    }
  })

  async function onSubmit(e: FormSubmitEvent) {
    e.preventDefault()
    if (loading) return
    const newMessage = String(e.currentTarget.newMessage.value ?? '').trim()
    if (newMessage.length < 2) {
      return
    }
    e.currentTarget.reset()
    messages.push({ role: 'user', content: newMessage })
    loading = true
    scrollToBottom()
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ api, messages })
    })
    const reader = response.body?.pipeThrough(new TextDecoderStream()).getReader()
    while (reader) {
      const { done, value } = await reader.read()
      if (done) {
        break
      }
      try {
        const chunks = value.replace(
          /}]}(.|\n)+?{/g, '}]}<new chunk>{'
        ).replace(/\n$/, '').split('<new chunk>').map(
          chunk => JSON.parse(chunk)
        )
        for (const chunk of chunks) {
          const [{ delta }] = chunk.choices
          if (delta.content) {
            answer += delta.content
          }
        }
      } catch (e) {
        console.error(e)
      }
    }
    if (answer) {
      messages.push({ role: 'assistant', content: answer })
      answer = ''
    }
    loading = false
    scrollToBottom()
  }

  function scrollToBottom() {
    setTimeout(() => {
      scrollToDiv.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' })
    }, 100)
  }
</script>

<svelte:head>
  <title>Chatbot</title>
</svelte:head>

<div class="flex-1 flex flex-col gap-2 md:gap-4 h-px w-full max-w-3xl mx-auto">
  <div class="flex-1 flex flex-col gap-2 overflow-y-scroll">
    {#each messages as message}
      <Message {...message} />
    {/each}
    {#if answer}
      <Message role="assistant" content={answer} />
    {/if}
    <div bind:this={scrollToDiv} />
  </div>

  <form
    onsubmit={onSubmit}
    method="POST"
    class="flex gap-2"
  >
    <input
      type="hidden"
      name="api"
      value={api}
    />

    <input
      type="hidden"
      name="model"
      value={model}
    />

    <input
      type="hidden"
      name="oldMessages"
      value={JSON.stringify(messages)}
    />

    <input
      type="text"
      name="newMessage"
      autocomplete="off"
      required
      minlength="2"
      placeholder="Type a message"
      disabled={loading}
      class="input"
    />

    <button
      type="submit"
      disabled={loading}
      class="btn-icon variant-filled-primary"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 -960 960 960"
        width="24"
        height="24"
      >
        <path d="M792-443 176-183q-20 8-38-3.5T120-220v-520q0-22 18-33.5t38-3.5l616 260q25 11 25 37t-25 37ZM200-280l474-200-474-200v140l240 60-240 60v140Zm0 0v-400 400Z" />
      </svg>
    </button>
  </form>
</div>
