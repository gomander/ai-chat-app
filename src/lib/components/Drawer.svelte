<script lang="ts">
  import { fly, fade } from 'svelte/transition'
  import { browser } from '$app/environment'
  import Icon from '$lib/components/Icon.svelte'
  import optionsStore from '$lib/stores/options.svelte'
  import models from '$lib/data/models'
  import { Api, type FormSubmitEvent } from '$types/common'

  let { open = $bindable(false), onOpenOptionsDialog }: {
    open: boolean
    onOpenOptionsDialog: () => void
  } = $props()

  let modelOptions = $derived(Object.keys(models[optionsStore.api]))
  let systemPrompt = $state(optionsStore.systemPrompt)
  let drawerElement = $state<HTMLDivElement>()

  $effect(() => {
    if (open) {
      drawerElement?.focus()
      window.addEventListener('keydown', handleKeyDown)
    } else {
      window.removeEventListener('keydown', handleKeyDown)
    }
  })

  $effect(() => {
    if (!modelOptions.includes(optionsStore.model)) {
      optionsStore.model = 'default'
    }
    if (browser) {
      localStorage.setItem('options',
        JSON.stringify({
          api: optionsStore.api,
          model: optionsStore.model,
          systemPrompt: optionsStore.systemPrompt
        })
      )
    }
  })

  function handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      open = false
    }
  }

  function onSubmit(event: FormSubmitEvent) {
    event.preventDefault()
    optionsStore.systemPrompt = systemPrompt
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
  />

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

    <form
      onsubmit={onSubmit}
      class="flex flex-col gap-2"
    >
      <label class="label">
        <span>API</span>
        <select class="select" name="api" bind:value={optionsStore.api}>
          {#each Object.values(Api) as apiOption}
            <option value={apiOption}>{apiOption}</option>
          {/each}
        </select>
      </label>

      <label class="label">
        <span>Model</span>
        <select class="select" name="model" bind:value={optionsStore.model}>
          {#each modelOptions as modelOption}
            <option value={modelOption}>{modelOption}</option>
          {/each}
        </select>
      </label>

      <label class="label">
        <span>System Prompt</span>
        <textarea
          class="textarea"
          name="systemPrompt"
          bind:value={systemPrompt}
        />
      </label>

      <button
        disabled={!systemPrompt || systemPrompt === optionsStore.systemPrompt}
        class="btn variant-filled-primary"
      >
        Save
      </button>
    </form>
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
