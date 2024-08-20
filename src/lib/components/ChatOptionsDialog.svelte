<script lang="ts">
  import { goto } from '$app/navigation'
  import { Accordion, AccordionItem } from '@skeletonlabs/skeleton'
  import { fileSave } from 'browser-fs-access'
  import chatStore from '$lib/stores/chat.svelte'
  import chatsStore from '$lib/stores/chats.svelte'
  import models, { getDefaultModel } from '$lib/data/models'
  import { DEFAULT_API_OPTIONS, DEFAULT_DISPLAY_OPTIONS } from '$lib/data/constants'
  import Icon from '$lib/components/Icon.svelte'
  import { Api, type FormSubmitEvent } from '$types/common'

  const apis = [
    { label: 'OpenAI', value: Api.OPENAI },
    { label: 'Anthropic', value: Api.ANTHROPIC },
    { label: 'GoogleAI', value: Api.GOOGLEAI }
  ]

  let { open = $bindable(false) }: { open: boolean } = $props()

  let dialog = $state<HTMLDialogElement>()
  let name = $state(DEFAULT_DISPLAY_OPTIONS.name)
  let api = $state(DEFAULT_API_OPTIONS.api)
  let model = $state(DEFAULT_API_OPTIONS.model)
  let systemPrompt = $state<string>()
  let maxTokens = $state<number>()
  let temperature = $state<number>()
  let stopSequencesString = $state<string>()
  let stream = $state(DEFAULT_API_OPTIONS.stream)

  let modelMaxTokens = $derived(models[api][model]?.maxTokens.output)
  let modelMaxTemperature = $derived(models[api][model]?.maxTemperature)

  $effect(() => {
    if (open) {
      dialog?.showModal()
      name = chatStore.chat.displayOptions.name
      api = chatStore.chat.apiOptions.api
      model = chatStore.chat.apiOptions.model
      systemPrompt = chatStore.chat.apiOptions.systemPrompt
      maxTokens = chatStore.chat.apiOptions.maxTokens
      temperature = chatStore.chat.apiOptions.temperature
      stopSequencesString = chatStore.chat.apiOptions.stopSequences?.join(', ')
      stream = chatStore.chat.apiOptions.stream
    } else {
      dialog?.close()
    }
  })

  $effect(() => {
    if (!models[api][model]) {
      model = getDefaultModel(api).key
    }
    if (maxTokens) {
      maxTokens = Math.min(maxTokens, models[api][model].maxTokens.output)
    }
    if (temperature) {
      temperature = Math.min(temperature, models[api][model].maxTemperature)
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
    const chat = chatsStore.chats.find(chat => chat.id === chatStore.id)
    const newApiOptions = {
      api,
      model,
      systemPrompt: systemPrompt?.trim() || undefined,
      maxTokens,
      temperature,
      stopSequences: stopSequencesString
        ?.replaceAll('\\,', '<escaped-comma>')
        .split(',')
        .map(string => string.trim().replaceAll('<escaped-comma>', ','))
        .filter(string => string)
        .slice(0, 3),
      stream: api !== Api.GOOGLEAI ? stream : false
    }
    chatStore.chat.apiOptions = newApiOptions
    const newDisplayOptions = { name }
    chatStore.chat.displayOptions = newDisplayOptions
    if (chat) {
      chat.apiOptions = newApiOptions
      chat.displayOptions = newDisplayOptions
      chat.updatedAt = Date.now()
    } else {
      chatsStore.chats.push({
        id: chatStore.id,
        apiOptions: newApiOptions,
        displayOptions: newDisplayOptions,
        updatedAt: Date.now()
      })
    }
    open = false
  }

  function downloadChat() {
    fileSave(
      new Blob([JSON.stringify(chatStore.chat)]),
      {
        fileName: `${chatStore.chat.displayOptions.name || 'New chat'}.json`,
        mimeTypes: ['application/json'],
        extensions: ['.json']
      }
    )
  }

  function deleteCurrentChat() {
    localStorage.removeItem(`chat-${chatStore.id}`)
    chatsStore.chats = chatsStore.chats.filter(chat => chat.id !== chatStore.id)
    open = false
    goto('/')
  }
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<dialog
  onclick={handleClick}
  bind:this={dialog}
  class="bg-surface-100-800-token text-on-surface-token"
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
        <span>Chat name</span>
        <input
          type="text"
          name="name"
          bind:value={name}
          placeholder={DEFAULT_DISPLAY_OPTIONS.name || 'New chat'}
          autocomplete="off"
          class="input"
        >
      </label>

      <div class="flex gap-2">
        <label class="label flex-1">
          <span>API</span>
          <select
            name="api"
            bind:value={api}
            class="select"
          >
            {#each apis as { label, value }}
              <option {value}>{label}</option>
            {/each}
          </select>
        </label>

        <label class="label flex-1">
          <span>Model</span>
          <select
            name="model"
            bind:value={model}
            class="select"
          >
            {#each Object.entries(models[api]) as [key, modelData]}
              <option value={key}>{modelData.name}</option>
            {/each}
          </select>
        </label>
      </div>

      <label class="label">
        <span>System prompt</span>
        <textarea
          name="systemPrompt"
          bind:value={systemPrompt}
          placeholder="You are a helpful assistant."
          class="textarea min-h-24"
        ></textarea>
      </label>

      <Accordion class="card p-2 text-token">
        <AccordionItem>
          <svelte:fragment slot="lead"><Icon name="settings" /></svelte:fragment>
          <svelte:fragment slot="summary">
            <p class="font-bold">Advanced options</p>
          </svelte:fragment>
          <svelte:fragment slot="iconClosed"><Icon name="caretUp" /></svelte:fragment>
          <svelte:fragment slot="iconOpen"><Icon name="caretDown" /></svelte:fragment>
          <svelte:fragment slot="content">
            <div class="pt-2 -mx-4 flex flex-col gap-2">
              <div class="flex gap-2">
                <label class="label">
                  <span>Max tokens (1 - {modelMaxTokens})</span>
                  <input
                    type="number"
                    name="maxTokens"
                    min={1}
                    max={modelMaxTokens}
                    bind:value={maxTokens}
                    placeholder="Not set"
                    class="input"
                  >
                </label>

                <label class="label">
                  <span>Temperature (0 - {modelMaxTemperature})</span>
                  <input
                    type="number"
                    name="temperature"
                    min={0}
                    max={modelMaxTemperature}
                    step={0.1}
                    bind:value={temperature}
                    placeholder="Not set"
                    class="input"
                  >
                </label>
              </div>

              <label class="label">
                <span>Stop sequences (max 4, comma separated)</span>
                <input
                  type="text"
                  name="stopSequences"
                  bind:value={stopSequencesString}
                  placeholder="None set"
                  class="input"
                >
              </label>

              {#if api !== Api.GOOGLEAI}
                <label class="label flex items-center gap-2 space-y-0">
                  <input
                    type="checkbox"
                    name="stream"
                    bind:checked={stream}
                    class="checkbox"
                  >
                  <span>Stream</span>
                </label>
              {/if}

              <button
                class="btn variant-filled-surface"
                onclick={downloadChat}
              >
                <Icon name="download" />
                <span>Download chat</span>
              </button>
            </div>
          </svelte:fragment>
        </AccordionItem>
      </Accordion>
      <div class="flex gap-2">
        <button
          type="button"
          onclick={deleteCurrentChat}
          class="btn variant-filled-error"
        >
          <Icon name="delete" />
          <span>Delete chat</span>
        </button>
        <button class="btn variant-filled-primary flex-grow">
          <Icon name="save" />
          <span>Save</span>
        </button>
      </div>
    </form>
  </div>
</dialog>

<style>
  dialog {
    position: fixed;
    inset: 0;
    padding: 0.75rem;
    border-radius: 1rem;
    max-width: calc(100% - 1rem);
    width: 640px;
    z-index: 30;
  }

  dialog::backdrop {
    background-color: rgba(0 0 0 / 0.5);
  }
</style>
