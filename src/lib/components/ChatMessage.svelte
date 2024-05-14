<script lang="ts">
  import { parse } from 'marked'
  import DOMPurify from 'dompurify'
  import type { ApiMessage } from '$types/common'

  let { content, role }: ApiMessage = $props()

  const dirtyHtml = parse(content)
</script>

<div
  class="relative wrapper-{role}"
  aria-label="{role} message"
>
  <div class="p-3 mx-2 rounded-2xl max-w-prose flex flex-col gap-2 overflow-x-auto message message-{role}">
    {#await dirtyHtml then htmlContent}
      {@html DOMPurify.sanitize(htmlContent)}
    {/await}
  </div>
</div>

<style>
  .wrapper-user {
    align-self: flex-end;
  }

  .message :global(pre) {
    background-color: rgb(var(--color-surface-700));
    color: rgb(var(--on-surface));
    padding: 0.5rem;
    border-radius: 0.25rem;
    overflow-x: auto;
  }

  .message :global(pre > code) {
    background-color: unset;
    padding: 0;
    border-radius: 0;
  }

  .message :global(code) {
    background-color: rgb(var(--color-surface-700));
    color: rgb(var(--on-surface));
    padding: 0.25rem;
    border-radius: 0.25rem;
  }

  .message :global(ul) {
    list-style-type: disc;
    padding-left: 1rem;
  }

  .message :global(ol) {
    list-style-type: decimal;
    padding-left: 1rem;
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
