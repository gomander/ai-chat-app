<script lang="ts">
  import { fade } from 'svelte/transition'
  import optionsStore, { setOptions } from '$lib/stores/options.svelte'
  import ChatMessage from '$lib/components/ChatMessage.svelte'
  import Icon from '$lib/components/Icon.svelte'
  import MessageForm from '$lib/components/MessageForm.svelte'
  import { saveChat, saveChatMessages, saveChatOptions } from '$lib/utils/local-storage'
  import { streamResponse } from '$lib/utils/stream'
  import { Role } from '$types/common'
  import type { ApiMessage, FormSubmitEvent, Message } from '$types/common'

  let { data } = $props()

  let messages = $state<Message[]>([...data.chat.messages])
  let answer = $state<ApiMessage>({ role: Role.ASSISTANT, content: '' })
  let loading = $state(false)
  let showScrollToBottom = $state(false)
  let messagesContainer = $state<HTMLDivElement>()
  let scrollToDiv = $state<HTMLDivElement>()

  let disabled = $derived(loading || !!answer.content)

  // Navigating to another chat
  $effect(() => {
    messages = [...data.chat.messages]
    setOptions(data.chat.options)
  })

  // Save chat options when they change
  $effect(() => saveChatOptions(data.chatId, optionsStore))

  // Save chat messages and scroll to bottom when they change
  $effect(() => {
    if (messages.length) {
      if (messages.length === 1) {
        saveChat(data.chatId, { messages, options: optionsStore })
      }
      saveChatMessages(data.chatId, messages)
      setTimeout(scrollToBottom, 100)
    }
  })

  async function generateResponse() {
    loading = true
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: messages.map(message => ({ role: message.role, content: message.content })),
          ...optionsStore,
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

  function onSubmit(e: FormSubmitEvent) {
    e.preventDefault()
    const newMessage = String(e.currentTarget.newMessage.value || '').trim()
    if (disabled || newMessage.length < 2) return
    e.currentTarget.reset()
    messages.push({ role: Role.USER, content: newMessage, id: crypto.randomUUID() })
    generateResponse()
  }

  function regenerateResponse() {
    messages.splice(-1, 1)
    generateResponse()
  }

  function handleScroll() {
    showScrollToBottom = !!messagesContainer &&
      messagesContainer.scrollTop < (
        messagesContainer.scrollHeight - messagesContainer.clientHeight - 500
      )
  }

  function scrollToBottom() {
    scrollToDiv?.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' })
  }
</script>

<svelte:head>
  <title>Chatbot</title>
</svelte:head>

<div class="flex-1 flex flex-col justify-end min-h-96 h-px w-full max-w-3xl mx-auto">
  <div
    onscroll={handleScroll}
    bind:this={messagesContainer}
    class="relative flex flex-col gap-2 overflow-y-scroll pt-16 pb-2 -mx-2"
  >
    {#each messages as message (message.id)}
      <ChatMessage {...message} />
    {/each}
    {#if answer.content}
      <ChatMessage {...answer} />
    {:else if loading}
      <div class="flex justify-center">
        <div class="animate-spin">
          <Icon name="loading" />
        </div>
      </div>
    {:else if messages.at(-1)?.role === Role.ASSISTANT}
      <button
        onclick={regenerateResponse}
        class="btn-icon btn-icon-sm"
        title="Regenerate response"
        aria-label="Regenerate response"
      >
        <Icon name="regenerate" />
      </button>
    {:else if messages.at(-1)?.role === Role.USER}
      <button
        onclick={generateResponse}
        class="btn-icon btn-icon-sm"
        title="Generate response"
        aria-label="Generate response"
      >
        <Icon name="send" />
      </button>
    {/if}
    {#if showScrollToBottom}
      <div
        transition:fade
        class="fixed bottom-20 left-0 right-0 flex justify-center"
      >
        <button
          onclick={scrollToBottom}
          class="btn-icon btn-icon-sm variant-glass-primary"
          title="Scroll to bottom"
          aria-label="Scroll to bottom"
        >
          <Icon name="arrowDown" />
        </button>
      </div>
    {/if}
    <div bind:this={scrollToDiv}></div>
  </div>

  <MessageForm {onSubmit} {disabled} />
</div>
