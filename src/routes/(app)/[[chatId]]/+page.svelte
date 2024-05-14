<script lang="ts">
  import { fade } from 'svelte/transition'
  import ChatOptionsDialog from '$lib/components/ChatOptionsDialog.svelte'
  import ChatMessage from '$lib/components/ChatMessage.svelte'
  import Icon from '$lib/components/Icon.svelte'
  import MessageForm from '$lib/components/MessageForm.svelte'
  import { streamResponse } from '$lib/utils/stream'
  import { Role } from '$types/common'
  import type { ApiMessage, FormSubmitEvent } from '$types/common'

  let { data } = $props()

  let answer = $state<ApiMessage>({ role: Role.ASSISTANT, content: '' })
  let loading = $state(false)
  let optionsOpen = $state(false)
  let showScrollToBottom = $state(false)
  let messagesContainer = $state<HTMLDivElement>()
  let scrollToDiv = $state<HTMLDivElement>()

  let disabled = $derived(loading || !!answer.content)

  $effect(() => {
    if (data.chat.messages.length) {
      setTimeout(scrollToBottom, 100)
    }
  })

  async function generateResponse() {
    if (loading) return
    loading = true
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: data.chat.messages.map(message => ({
            role: message.role, content: message.content
          })),
          ...data.chat.apiOptions,
          stream: true
        })
      })
      if (!response.ok || !response.body) {
        throw new Error('Failed to fetch')
      }
      loading = false
      const interval = setInterval(scrollToBottom, 200)
      await streamResponse(response.body, answer, data.chat.apiOptions.api)
      clearInterval(interval)
    } catch (error) {
      console.error(error)
      loading = false
    }
    if (answer.content) {
      data.chat.messages.push({ ...answer, id: crypto.randomUUID() })
      const chat = data.chats.find(chat => chat.id === data.chatId)
      if (chat) {
        chat.updatedAt = Date.now()
      } else {
        data.chats.push({
          id: data.chatId,
          apiOptions: data.chat.apiOptions,
          displayOptions: data.chat.displayOptions,
          updatedAt: Date.now()
        })
      }
      localStorage.setItem(`chat-${data.chatId}`, JSON.stringify(data.chat.messages))
    }
    answer.content = ''
  }

  function onSubmit(e: FormSubmitEvent) {
    e.preventDefault()
    const newMessage = String(e.currentTarget.newMessage.value || '').trim()
    if (disabled || newMessage.length < 2) return
    e.currentTarget.reset()
    data.chat.messages.push({ role: Role.USER, content: newMessage, id: crypto.randomUUID() })
    generateResponse()
  }

  function regenerateResponse() {
    data.chat.messages.splice(-1, 1)
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

<ChatOptionsDialog
  bind:open={optionsOpen}
  chatId={data.chatId}
  chatData={data.chat}
  chats={data.chats}
/>

<button
  onclick={() => optionsOpen = true}
  class="btn-icon variant-glass fixed top-2 right-2 z-10"
  title="Settings"
  aria-label="Open settings"
>
  <Icon name="settings" />
</button>

<div class="flex-1 flex flex-col justify-end min-h-96 h-px w-full max-w-3xl mx-auto">
  <div
    onscroll={handleScroll}
    bind:this={messagesContainer}
    class="relative flex flex-col gap-2 overflow-y-scroll pt-16 pb-2 -mx-2"
  >
    {#each data.chat.messages as message (message.id)}
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
    {:else if data.chat.messages.at(-1)?.role === Role.ASSISTANT}
      <button
        onclick={regenerateResponse}
        class="btn-icon btn-icon-sm"
        title="Regenerate response"
        aria-label="Regenerate response"
      >
        <Icon name="regenerate" />
      </button>
    {:else if data.chat.messages.at(-1)?.role === Role.USER}
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
