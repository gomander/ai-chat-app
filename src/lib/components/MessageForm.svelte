<script lang="ts">
  import Icon from '$lib/components/Icon.svelte'
  import type { ApiType, FormSubmitEvent, Message } from '$types/common'

  let { onSubmit, messages, api, model, disabled }: {
    onSubmit: (e: FormSubmitEvent) => void,
    messages: Message[],
    api: ApiType,
    model: string,
    disabled: boolean
  } = $props()
</script>

<form
  onsubmit={onSubmit}
  method="POST"
  class="flex gap-2"
>
  <input
    type="hidden"
    name="api"
    value={api}
  />

  <input
    type="hidden"
    name="model"
    value={model}
  />

  <input
    type="hidden"
    name="oldMessages"
    value={JSON.stringify(messages)}
  />

  <input
    type="text"
    name="newMessage"
    autocomplete="off"
    required
    minlength="2"
    placeholder="Type a message"
    {disabled}
    class="input"
  />

  <button
    type="submit"
    {disabled}
    class="btn-icon variant-filled-primary flex-shrink-0"
  >
    <Icon name="send" color="black" />
  </button>
</form>
