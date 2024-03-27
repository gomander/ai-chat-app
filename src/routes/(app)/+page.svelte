<script lang="ts">
  import { enhance } from '$app/forms'
  import Message from '$lib/components/Message.svelte'
  import type { EnhanceSubmitCallbackOptions, EnhanceSubmitOptions } from '$types/common'

  let { data, form } = $props()
  let messages = $derived(form?.messages || data.messages)
  let api = $derived(form?.api || data.api)
  let loading = $state(false)

  async function submitFunction({ formData, cancel }: EnhanceSubmitOptions) {
    if (loading) return
    const newMessage = String(formData.get('newMessage') ?? '').trim()
    if (newMessage.length < 2) {
      cancel()
      return
    }
    loading = true
    return async ({ update }: EnhanceSubmitCallbackOptions) => {
      loading = false
      update()
    }
  }
</script>

<svelte:head>
  <title>Chatbot</title>
</svelte:head>

<div class="flex-1 flex flex-col gap-2 md:gap-4 h-px">
  <div class="flex-1 flex flex-col gap-2 overflow-y-scroll p-2">
    {#each messages as message}
      <Message {...message} />
    {/each}
  </div>

  <form
    use:enhance={submitFunction}
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
      disabled={loading}
      class="input"
    />

    <button
      type="submit"
      disabled={loading}
      class="btn-icon variant-filled-primary"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 -960 960 960"
        width="24"
        height="24"
      >
        <path d="M792-443 176-183q-20 8-38-3.5T120-220v-520q0-22 18-33.5t38-3.5l616 260q25 11 25 37t-25 37ZM200-280l474-200-474-200v140l240 60-240 60v140Zm0 0v-400 400Z" />
      </svg>
    </button>
  </form>
</div>
