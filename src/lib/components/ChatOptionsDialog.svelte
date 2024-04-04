<script lang="ts">
  import Icon from '$lib/components/Icon.svelte'
  import optionsStore from '$lib/stores/options.svelte'
  import models from '$lib/data/models'
  import { Api } from '$types/common'

  let { open = $bindable(false) }: { open: boolean } = $props()

  let dialog = $state<HTMLDialogElement>()

  let modelOptions = $derived(Object.keys(models[optionsStore.api]))

  $effect(() => {
    if (open) {
      dialog?.showModal()
    } else {
      dialog?.close()
    }
  })

  function handleClick(e: MouseEvent) {
    if (!dialog || e.target !== dialog) return
    const rect = dialog.getBoundingClientRect()
    if (
      e.clientX < rect.left ||
      e.clientX > rect.right ||
      e.clientY < rect.top ||
      e.clientY > rect.bottom
    ) {
      open = false
    }
  }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
<dialog
  onclick={handleClick}
  bind:this={dialog}
  class="w-modal bg-surface-100-800-token text-on-surface-token"
>
  <div class="flex flex-col gap-2">
    <header class="flex justify-between items-center">
      <h2 class="text-2xl">Chat Options</h2>

      <button
        class="btn-icon variant-soft"
        onclick={() => open = false}
      >
        <Icon name="close" />
      </button>
    </header>

    <form
      method="dialog"
      class="flex flex-col gap-2"
    >
      <label class="label">
        <span>API</span>
        <select
          name="api"
          value={optionsStore.api}
          class="select"
        >
          {#each Object.values(Api) as apiOption}
            <option value={apiOption}>{apiOption}</option>
          {/each}
        </select>
      </label>

      <label class="label">
        <span>Model</span>
        <select
          name="model"
          value={optionsStore.model}
          class="select"
        >
          {#each modelOptions as modelOption}
            <option value={modelOption}>{modelOption}</option>
          {/each}
        </select>
      </label>

      <label class="label">
        <span>System prompt</span>
        <textarea
          name="systemPrompt"
          placeholder="You are a helpful assistant."
          class="textarea"
        />
      </label>
      <button class="btn variant-filled-primary">Save</button>
    </form>
  </div>
</dialog>

<style>
  dialog {
    position: fixed;
    inset: 0;
    z-index: 1000;
    padding: 1rem;
    border-radius: 1rem;
  }

  dialog::backdrop {
    background-color: rgba(0 0 0 / 0.5);
  }
</style>
