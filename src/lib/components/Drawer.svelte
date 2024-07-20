<script lang="ts">
  import { onNavigate } from '$app/navigation'
  import { fly, fade } from 'svelte/transition'
  import chatStore from '$lib/stores/chat.svelte'
  import chatsStore from '$lib/stores/chats.svelte'
  import Icon from '$lib/components/Icon.svelte'

  let { open = $bindable(false) }: { open: boolean } = $props()

  let drawerElement = $state<HTMLDivElement>()

  let sortedChats = $derived(chatsStore.chats.toSorted((a, b) => b.updatedAt - a.updatedAt))

  onNavigate(() => {
    open = false
  })

  $effect(() => {
    if (open) {
      drawerElement?.focus()
      window.addEventListener('keydown', handleKeyDown)
    } else {
      window.removeEventListener('keydown', handleKeyDown)
    }
  })

  function handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      open = false
    }
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
    class="fixed-overlay drawer flex flex-col gap-2"
    transition:fly={{ x: -320 }}
  >
    <div class="flex justify-between items-center">
      <h2 class="text-2xl">Chats</h2>

      <button
        onclick={() => open = false}
        class="btn-icon variant-soft-primary"
      >
        <Icon name="close" />
      </button>
    </div>

    {#each sortedChats as chat}
      <a
        href={`/${chat.id}`}
        class="btn {
          chatStore.id === chat.id
            ? 'variant-glass-primary'
            : 'hover:variant-ghost-primary'
        }"
      >
        {chat.displayOptions.name || 'New chat'}
      </a>
    {/each}

    <a
      href="/"
      class="btn variant-filled-primary"
    >
      <Icon name="plus" />
      <span>New chat</span>
    </a>
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
    background-color: rgb(var(--color-surface-800));
    padding: 1rem;
  }
</style>
