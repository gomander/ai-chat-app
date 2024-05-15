<script lang="ts">
  import { goto } from '$app/navigation'
  import { Accordion, AccordionItem } from '@skeletonlabs/skeleton'
  import models, { getDefaultModel } from '$lib/data/models'
  import { DEFAULT_API_OPTIONS, DEFAULT_DISPLAY_OPTIONS } from '$lib/data/constants'
  import Icon from '$lib/components/Icon.svelte'
  import { Api, type ChatData, type ChatMeta, type FormSubmitEvent } from '$types/common'

  const apis = [
    { label: 'OpenAI', value: Api.OPENAI },
    { label: 'Anthropic', value: Api.ANTHROPIC }
  ]

  let { open = $bindable(false), chatId, chatData, chats }: {
    open: boolean
    chatId: string
    chatData: ChatData
    chats: ChatMeta[]
  } = $props()

  let dialog = $state<HTMLDialogElement>()
  let name = $state(DEFAULT_DISPLAY_OPTIONS.name)
  let api = $state(DEFAULT_API_OPTIONS.api)
  let model = $state(DEFAULT_API_OPTIONS.model)
  let systemPrompt = $state<string>()
  let maxTokens = $state<number>()
  let temperature = $state<number>()
  let stopSequencesString = $state<string>()

  let modelMaxTokens = $derived(models[api][model]?.maxTokens.output)
  let modelMaxTemperature = $derived(models[api][model]?.maxTemperature)

  $effect(() => {
    if (open) {
      dialog?.showModal()
      name = chatData.displayOptions.name
      api = chatData.apiOptions.api
      model = chatData.apiOptions.model
      systemPrompt = chatData.apiOptions.systemPrompt
      maxTokens = chatData.apiOptions.maxTokens
      temperature = chatData.apiOptions.temperature
      stopSequencesString = chatData.apiOptions.stopSequences?.join(', ')
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
    const chat = chats.find(chat => chat.id === chatId)
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
        .slice(0, 3)
    }
    chatData.apiOptions = newApiOptions
    const newDisplayOptions = { name }
    chatData.displayOptions = newDisplayOptions
    if (chat) {
      chat.apiOptions = newApiOptions
      chat.displayOptions = newDisplayOptions
      chat.updatedAt = Date.now()
    } else {
      chats.push({
        id: chatId,
        apiOptions: newApiOptions,
        displayOptions: newDisplayOptions,
        updatedAt: Date.now()
      })
    }
    localStorage.setItem('chats', JSON.stringify(chats))
    open = false
  }

  function deleteCurrentChat() {
    localStorage.removeItem(`chat-${chatId}`)
    localStorage.setItem('chats', JSON.stringify(chats.filter(chat => chat.id !== chatId)))
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
          placeholder={DEFAULT_DISPLAY_OPTIONS.name}
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
            <div class="pt-2 flex gap-2">
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
          </svelte:fragment>
        </AccordionItem>
      </Accordion>
      <div class="flex gap-2">
        <button
          type="button"
          onclick={deleteCurrentChat}
          class="btn variant-filled-error"
        >
          Delete chat
        </button>
        <button class="btn variant-filled-primary flex-grow">Save</button>
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
