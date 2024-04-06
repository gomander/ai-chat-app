<script lang="ts">
  import { onMount } from 'svelte'
  import { browser } from '$app/environment'
  import ChatMessage from '$lib/components/ChatMessage.svelte'
  import MessageForm from '$lib/components/MessageForm.svelte'
  import optionsStore from '$lib/stores/options.svelte'
  import { assertMessages } from '$lib/utils/common'
  import { streamResponse } from '$lib/utils/stream'
  import type { ApiMessage, FormSubmitEvent, Message } from '$types/common'

  let messages = $state<Message[]>([])
  let answer = $state<ApiMessage>({ role: 'assistant', content: '' })
  let loading = $state(false)

  let disabled = $derived(loading || !!answer.content)

  let scrollToDiv = $state<HTMLDivElement>()

  onMount(() => {
    try {
      const storedMessages = JSON.parse(localStorage.getItem('messages') || '[]')
      assertMessages(storedMessages)
      messages = storedMessages
    } catch (e) {
      localStorage.removeItem('messages')
    }
  })

  $effect(() => {
    if (browser && messages.length) {
      localStorage.setItem('messages', JSON.stringify(messages))
      setTimeout(scrollToBottom, 100)
    }
  })

  async function onSubmit(e: FormSubmitEvent) {
    e.preventDefault()
    const newMessage = String(e.currentTarget.newMessage.value || '').trim()
    if (disabled || newMessage.length < 2) return
    e.currentTarget.reset()
    messages.push({ role: 'user', content: newMessage, id: crypto.randomUUID() })
    loading = true
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: messages.map(message => ({ role: message.role, content: message.content })),
          api: optionsStore.api,
          model: optionsStore.model,
          systemPrompt: optionsStore.systemPrompt,
          maxTokens: optionsStore.maxTokens,
          temperature: optionsStore.temperature,
          stopSequences: optionsStore.stopSequences,
          stream: true
        })
      })
      if (!response.ok || !response.body) {
        throw new Error('Failed to fetch')
      }
      loading = false
      const interval = setInterval(scrollToBottom, 200)
      await streamResponse(response.body, answer, optionsStore.api)
      clearInterval(interval)
    } catch (error) {
      console.error(error)
      loading = false
    }
    if (answer.content) {
      messages.push({ ...answer, id: crypto.randomUUID() })
    }
    answer.content = ''
  }

  function scrollToBottom() {
    scrollToDiv?.scrollIntoView({
      behavior: 'smooth', block: 'end', inline: 'nearest'
    })
  }
</script>

<svelte:head>
  <title>Chatbot</title>
</svelte:head>

<div class="flex-1 flex flex-col justify-end min-h-96 h-px w-full max-w-3xl mx-auto">
  <div class="flex flex-col gap-2 overflow-y-scroll py-2 -mx-2 transition-all">
    {#each messages as message (message.id)}
      <ChatMessage {...message} />
    {/each}
    {#if answer.content}
      <ChatMessage {...answer} />
    {/if}
    <div bind:this={scrollToDiv} />
  </div>

  <MessageForm {onSubmit} {disabled} />
</div>
