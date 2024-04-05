<script lang="ts">
  import Icon from '$lib/components/Icon.svelte'
  import optionsStore, { saveToLocalStorage } from '$lib/stores/options.svelte'
  import models, { getDefaultModel } from '$lib/data/models'
  import DEFAULT_SYSTEM_PROMPT from '$lib/data/system-prompts/default'
  import { Api, type FormSubmitEvent } from '$types/common'

  let { open = $bindable(false) }: { open: boolean } = $props()

  let dialog = $state<HTMLDialogElement>()
  let api = $state(optionsStore.api)
  let model = $state(optionsStore.model)
  let systemPrompt = $state(optionsStore.systemPrompt)

  $effect(() => {
    if (open) {
      dialog?.showModal()
    } else {
      dialog?.close()
    }
  })

  $effect(() => {
    if (!models[api][model]) {
      model = getDefaultModel(api).key
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

  function onSubmit(e: FormSubmitEvent) {
    e.preventDefault()
    optionsStore.api = api
    optionsStore.model = model
    optionsStore.systemPrompt = systemPrompt
    saveToLocalStorage()
    open = false
  }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
<dialog
  onclick={handleClick}
  bind:this={dialog}
  class="fixed inset-0 p-4 rounded-lg w-modal bg-surface-100-800-token text-on-surface-token z-30"
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
      onsubmit={onSubmit}
      class="flex flex-col gap-2"
    >
      <label class="label">
        <span>API</span>
        <select
          name="api"
          bind:value={api}
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
          bind:value={model}
          class="select"
        >
          {#each Object.entries(models[api]) as modelOption}
            <option value={modelOption[0]}>{modelOption[1].name}</option>
          {/each}
        </select>
      </label>

      <label class="label">
        <span>System prompt</span>
        <textarea
          name="systemPrompt"
          bind:value={systemPrompt}
          placeholder={DEFAULT_SYSTEM_PROMPT}
          class="textarea min-h-24"
        />
      </label>
      <button class="btn variant-filled-primary">Save</button>
    </form>
  </div>
</dialog>

<style>
  dialog::backdrop {
    background-color: rgba(0 0 0 / 0.5);
  }
</style>
