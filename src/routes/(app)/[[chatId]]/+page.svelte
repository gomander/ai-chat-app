<script lang="ts">
  import { fade } from 'svelte/transition'
  import { afterNavigate } from '$app/navigation'
  import chatStore from '$lib/stores/chat.svelte'
  import chatsStore from '$lib/stores/chats.svelte'
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

  function updateChatStore() {
    chatStore.chat = data.chat
    chatStore.id = data.chatId
  }

  updateChatStore()
  afterNavigate(updateChatStore)

  $effect(() => {
    if (chatStore.chat.messages.length) {
      setTimeout(scrollToBottom, 100)
    }
  })

  $effect(() => {
    localStorage.setItem(`chat-${chatStore.id}`, JSON.stringify(chatStore.chat.messages))
  })

  async function generateResponse() {
    if (loading) return
    loading = true
    try {
      if (!chatStore.chat.displayOptions.name) {
        generateChatName()
      }
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: chatStore.chat.messages.map(message => ({
            role: message.role, content: message.content
          })),
          ...chatStore.chat.apiOptions
        })
      })
      if (!response.ok || !response.body) {
        throw new Error('Failed to fetch')
      }
      loading = false
      if (chatStore.chat.apiOptions.stream) {
        const interval = setInterval(scrollToBottom, 200)
        await streamResponse(response.body, answer, chatStore.chat.apiOptions.api)
        clearInterval(interval)
      } else {
        answer.content = await response.text()
      }
    } catch (error) {
      console.error(error)
      loading = false
    }
    if (answer.content) {
      chatStore.chat.messages.push({ ...answer, id: crypto.randomUUID() })
      const chat = chatsStore.chats.find(chat => chat.id === chatStore.id)
      if (chat) {
        chat.updatedAt = Date.now()
      } else {
        chatsStore.chats.push({
          id: chatStore.id,
          apiOptions: chatStore.chat.apiOptions,
          displayOptions: chatStore.chat.displayOptions,
          updatedAt: Date.now()
        })
      }
    }
    answer.content = ''
  }

  function onSubmit(e: FormSubmitEvent) {
    e.preventDefault()
    const newMessage = String(e.currentTarget.newMessage.value || '').trim()
    if (disabled || newMessage.length < 2) return
    e.currentTarget.reset()
    chatStore.chat.messages.push({ role: Role.USER, content: newMessage, id: crypto.randomUUID() })
    generateResponse()
  }

  function regenerateResponse() {
    chatStore.chat.messages.splice(-1, 1)
    generateResponse()
  }

  async function generateChatName() {
    const response = await fetch('/api/chat/name', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: chatStore.chat.messages.map(message => ({
          role: message.role, content: message.content
        }))
      })
    })
    const { name } = await response.json()
    chatStore.chat.displayOptions.name = name
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

<ChatOptionsDialog bind:open={optionsOpen} />

<button
  onclick={() => optionsOpen = true}
  class="btn-icon variant-glass fixed top-2 right-2 z-10"
  title="Settings"
  aria-label="Open settings"
>
  <Icon name="settings" />
</button>

{#if !chatStore.chat.messages.length}
  <div class="h-full flex flex-col justify-center items-center">
    {#if chatStore.chat.displayOptions.name}
      <p>
        Send a message to <strong>{chatStore.chat.displayOptions.name}</strong> from the input below
      </p>
    {:else}
      <p>Start a new chat by sending a message from the input below</p>
    {/if}
  </div>
{/if}

<div class="relative flex-1 flex flex-col justify-end min-h-96 h-px w-full max-w-7xl mx-auto">
  <div
    onscroll={handleScroll}
    bind:this={messagesContainer}
    class="relative flex flex-col gap-2 overflow-y-scroll pt-16 -mx-2 w-full"
  >
    {#each chatStore.chat.messages as message (message.id)}
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
    {:else if chatStore.chat.messages.at(-1)?.role === Role.ASSISTANT}
      <button
        onclick={regenerateResponse}
        class="btn-icon btn-icon-sm"
        title="Regenerate response"
        aria-label="Regenerate response"
      >
        <Icon name="regenerate" />
      </button>
    {:else if chatStore.chat.messages.at(-1)?.role === Role.USER}
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
    <div
      bind:this={scrollToDiv}
      class="mt-12"
    ></div>
  </div>

  <MessageForm {onSubmit} {disabled} />
</div>
