<script lang="ts">
  import type { ApiMessage } from '$types/common'

  let { content, role }: ApiMessage = $props()
</script>

<div
  class="relative wrapper-{role}"
  aria-label="{role} message"
>
  <div class="px-4 py-2 mx-2 rounded-lg max-w-prose message message-{role}">
    {content}
  </div>
</div>

<style>
  .wrapper-user {
    align-self: flex-end;
  }

  .message {
    overflow-wrap: anywhere;
    white-space-collapse: preserve;
  }

  .message::after {
    content: '';
    position: absolute;
    width: 0;
    height: 0;
    top: 0;
    bottom: auto;
    border: 0.5rem solid;
  }

  .message-user {
    background-color: rgb(var(--color-primary-500));
    color: rgb(var(--on-primary));
    border-top-right-radius: 0;
  }

  .message-user::after {
    left: auto;
    right: 0;
    border-color: rgb(var(--color-primary-500)) transparent transparent;
  }

  .message-assistant {
    background-color: rgb(var(--color-surface-500));
    color: rgb(var(--on-surface));
    border-top-left-radius: 0;
  }

  .message-assistant::after {
    left: 0;
    right: auto;
    border-color: rgb(var(--color-surface-500)) transparent transparent;
  }
</style>
