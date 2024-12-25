<script lang="ts">
  import { MediaQuery } from 'svelte/reactivity'
  import { fly, fade } from 'svelte/transition'
  import { onNavigate, goto } from '$app/navigation'
  import { fileOpen } from 'browser-fs-access'
  import chatStore from '$lib/stores/chat.svelte'
  import chatsStore from '$lib/stores/chats.svelte'
  import Icon from '$lib/components/Icon.svelte'

  let { open = $bindable(false) }: { open: boolean } = $props()

  let drawerElement = $state<HTMLDivElement>()

  let sortedChats = $derived(
    chatsStore.chats.toSorted((a, b) => b.updatedAt - a.updatedAt)
  )

  onNavigate(() => {
    if (!large) {
      open = false
    }
  })

  $effect(() => {
    if (open) {
      drawerElement?.focus()
      window.addEventListener('keydown', handleKeyDown)
    } else {
      window.removeEventListener('keydown', handleKeyDown)
    }
  })

  const large = new MediaQuery('min-width: 1024px')

  function handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      open = false
    }
  }

  async function uploadChat() {
    const file = await fileOpen({
      mimeTypes: ['application/json'],
      extensions: ['json']
    })
    const text = await file.text()
    const { apiOptions, displayOptions, messages } = JSON.parse(text)
    const chatId = crypto.randomUUID()
    chatsStore.chats.push({
      id: chatId,
      apiOptions,
      displayOptions,
      updatedAt: Date.now()
    })
    chatStore.id = chatId
    chatStore.chat = messages
    goto(`/${chatId}`)
  }
</script>

{#if open}
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
  <div
    onclick={() => open = false}
    class="fixed-overlay drawer-backdrop"
    transition:fade
    role="dialog"
    aria-modal="true"
    aria-label="Drawer backdrop"
  ></div>

  <div
    bind:this={drawerElement}
    class="preset-filled-surface-50-950 fixed-overlay drawer flex flex-col gap-2"
    transition:fly={{ x: -320 }}
  >
    <div class="flex justify-between items-center">
      <h2 class="text-2xl">Chats</h2>

      <button
        onclick={() => open = false}
        class="btn-icon preset-filled-surface-100-900"
      >
        <Icon name="close" />
      </button>
    </div>

    {#each sortedChats as chat}
      <a
        href={`/${chat.id}`}
        class="btn {
          chatStore.id === chat.id
            ? 'preset-outlined-primary-500'
            : 'preset-outlined-surface-100-900'
        }"
      >
        {chat.displayOptions.name || 'New chat'}
      </a>
    {/each}

    <a
      href="/"
      class="btn preset-filled-primary-500"
    >
      <Icon name="plus" />
      <span>New chat</span>
    </a>

    <button
      class="btn preset-filled-surface-100-900"
      onclick={uploadChat}
    >
      <Icon name="upload" />
      <span>Upload chat</span>
    </button>
  </div>
{/if}

<style>
  .fixed-overlay {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    z-index: 20;
  }

  .drawer-backdrop {
    right: 0;
    background-color: rgba(0, 0, 0, 0.5);
  }

  .drawer {
    overflow-y: auto;
    width: 20rem;
    max-width: 75%;
    padding: 1rem;
  }

  @media (min-width: 1024px) {
    .drawer-backdrop {
      display: none;
    }
  }
</style>
