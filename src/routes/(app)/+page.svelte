<script lang="ts">
  import { onMount } from 'svelte'
  import { slide } from 'svelte/transition'
  import { browser } from '$app/environment'
  import ChatMessage from '$lib/components/ChatMessage.svelte'
  import MessageForm from '$lib/components/MessageForm.svelte'
  import optionsStore from '$lib/stores/options.svelte'
  import { assertMessages } from '$lib/utils/common'
  import { streamResponse } from '$lib/utils/stream'
  import type { ApiMessage, FormSubmitEvent } from '$types/common'

  let { data } = $props()

  let messages = $state(data.messages)
  let loading = $state(false)
  let answer = $state<ApiMessage>({ role: 'assistant', content: '' })

  let disabled = $derived(loading || !!answer.content)

  let scrollToDiv = $state<HTMLDivElement>()

  onMount(() => {
    if (browser) {
      try {
        const storedMessages = JSON.parse(localStorage.getItem('messages') || '[]')
        assertMessages(storedMessages)
        messages = storedMessages
      } catch (e) {
        localStorage.removeItem('messages')
      }
    }
  })

  $effect(() => {
    if (browser && messages.length) {
      localStorage.setItem('messages', JSON.stringify(messages))
      setTimeout(() => scrollToDiv?.scrollIntoView({
        behavior: 'smooth', block: 'end', inline: 'nearest'
      }), 50)
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
          api: optionsStore.api,
          model: optionsStore.model,
          systemPrompt: optionsStore.systemPrompt,
          messages
        })
      })
      if (!response.ok || !response.body) {
        throw new Error('Failed to fetch')
      }
      loading = false
      await streamResponse(response.body, answer, optionsStore.api)
    } catch (error) {
      console.error(error)
      loading = false
    }
    if (answer.content) {
      messages.push({ ...answer, id: crypto.randomUUID() })
    }
    answer.content = ''
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
      <div in:slide class="contents">
        <ChatMessage {...answer} />
      </div>
    {/if}
    <div bind:this={scrollToDiv} />
  </div>

  <MessageForm {onSubmit} {disabled} />
</div>
