<script lang="ts">
  import { onNavigate } from '$app/navigation'
  import { fly, fade } from 'svelte/transition'
  import Icon from '$lib/components/Icon.svelte'
  import type { ChatMeta } from '$types/common'

  let { open = $bindable(false), onOpenOptionsDialog, chats }: {
    open: boolean
    onOpenOptionsDialog: () => void,
    chats: ChatMeta[]
  } = $props()

  let drawerElement = $state<HTMLDivElement>()

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

  function openOptionsDialog() {
    open = false
    onOpenOptionsDialog()
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
      <h2 class="text-2xl">Options</h2>

      <button
        onclick={() => open = false}
        class="btn-icon variant-soft-primary"
      >
        <Icon name="close" />
      </button>
    </div>

    {#each chats as chat}
      <a
        href={`/${chat.id}`}
        class="btn variant-ghost-primary"
      >
        {chat.options.name}
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
