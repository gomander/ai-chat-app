<script lang="ts">
  import { onMount } from 'svelte'
  import { browser } from '$app/environment'
  import ChatMessage from '$lib/components/ChatMessage.svelte'
  import MessageForm from '$lib/components/MessageForm.svelte'
  import optionsStore from '$lib/stores/options.svelte'
  import { assertMessages } from '$lib/utils/common'
  import { streamResponse } from '$lib/utils/stream'
  import type { FormSubmitEvent, Message } from '$types/common'

  let { data, form } = $props()

  let messages = $state(form?.messages || data.messages)
  let loading = $state(false)
  let answer = $state<Message>({ role: 'assistant', content: '' })

  let api = $derived(form?.api || data.api)
  let model = $derived(form?.model || data.model)
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
    messages.push({ role: 'user', content: newMessage })
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
      await streamResponse(response.body, answer)
    } catch (error) {
      loading = false
    }
    if (answer.content) {
      messages.push({ ...answer })
    }
    answer.content = ''
  }
</script>

<svelte:head>
  <title>Chatbot</title>
</svelte:head>

<div class="flex-1 flex flex-col h-px w-full max-w-3xl mx-auto">
  <div class="flex-1 flex flex-col gap-2 overflow-y-scroll py-2 -mx-2">
    {#each messages as message}
      <ChatMessage {...message} />
    {/each}
    {#if answer.content}
      <ChatMessage {...answer} />
    {/if}
    <div bind:this={scrollToDiv} />
  </div>

  <MessageForm {onSubmit} {messages} {api} {model} {disabled} />
</div>
