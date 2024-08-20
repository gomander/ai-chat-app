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
  class="absolute bottom-2 w-full px-2 flex justify-center items-center gap-2"
>
  <input
    type="text"
    name="newMessage"
    autocomplete="off"
    required
    minlength="2"
    placeholder="Type a message"
    {disabled}
    class="input preset-filled-surface-100-900 shadow drop-shadow max-w-4xl"
  >

  <button
    type="submit"
    {disabled}
    class="btn-icon preset-filled-primary-500 flex-shrink-0 shadow drop-shadow"
    title="Send message"
    aria-label="Send message"
  >
    <Icon name="send" />
  </button>
</form>
