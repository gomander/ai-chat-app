<script lang="ts">
  import Icon from '$lib/components/Icon.svelte'
  import type { FormSubmitEvent } from '$types/common'

  let { onSubmit, disabled }: {
    onSubmit: (e: FormSubmitEvent) => void,
    disabled: boolean
  } = $props()
</script>

<form
  onsubmit={onSubmit}
  class="flex gap-2"
>
  <input
    type="text"
    name="newMessage"
    autocomplete="off"
    required
    minlength="2"
    placeholder="Type a message"
    {disabled}
    class="input"
  >

  <button
    type="submit"
    {disabled}
    class="btn-icon variant-filled-primary flex-shrink-0"
    title="Send message"
    aria-label="Send message"
  >
    <Icon name="send" />
  </button>
</form>
