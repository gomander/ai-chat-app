<script lang="ts">
  import autosize from 'svelte-autosize'
  import Icon from '$lib/components/Icon.svelte'
  import type { FormSubmitEvent } from '$types/common'

  let { onSubmit, disabled }: {
    onSubmit: (e: FormSubmitEvent) => void,
    disabled: boolean
  } = $props()

  let form = $state<HTMLFormElement>()

  function handleKeyDown(e: KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      form?.requestSubmit()
    }
  }
</script>

<form
  bind:this={form}
  onsubmit={onSubmit}
  class="absolute bottom-2 left-1/2 -translate-x-1/2 w-full max-w-4xl grid grid-cols-[1fr_auto] px-1"
>
  <textarea
    name="newMessage"
    autocomplete="off"
    placeholder="Type a message"
    onkeydown={handleKeyDown}
    {disabled}
    class="textarea preset-filled-surface-100-900 shadow drop-shadow rounded-r-none max-h-24"
    use:autosize
    rows={1}
  ></textarea>

  <button
    type="submit"
    {disabled}
    class="btn-icon preset-filled-primary-500 shadow drop-shadow w-auto h-full rounded-l-none ring ring-primary-500"
    title="Send message"
    aria-label="Send message"
  >
    <Icon name="send" />
  </button>
</form>
