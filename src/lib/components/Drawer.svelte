<script lang="ts">
  import { fly, fade } from 'svelte/transition'
  import Icon from '$lib/components/Icon.svelte'

  let { open = $bindable(false), onOpenOptionsDialog }: {
    open: boolean
    onOpenOptionsDialog: () => void
  } = $props()

  let drawerElement = $state<HTMLDivElement>()

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
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
  <div
    onclick={() => open = false}
    class="fixed-overlay drawer-backdrop"
    transition:fade
    role="dialog"
    aria-modal="true"
    aria-label="Drawer"
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

    <button
      onclick={openOptionsDialog}
      class="btn variant-filled-primary"
    >
      Open options dialog
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
    background-color: rgb(var(--color-surface-800));
    padding: 1rem;
  }
</style>
