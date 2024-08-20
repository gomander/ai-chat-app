<script lang="ts">
  import { parse } from 'marked'
  import DOMPurify from 'dompurify'
  import hljs from 'highlight.js'
  import type { ApiMessage } from '$types/common'

  let { content, role }: ApiMessage = $props()

  let messageContentDiv = $state<HTMLDivElement>()

  let cleanHtml = $derived(DOMPurify.sanitize(parse(content) as string))

  $effect(() => {
    cleanHtml && messageContentDiv?.querySelectorAll<HTMLElement>('pre code').forEach(el => {
      hljs.highlightElement(el);
    });
  })
</script>

<div
  class="relative {role === 'user' ? 'self-end' : ''}"
  aria-label="{role} message"
>
  <div
    bind:this={messageContentDiv}
    class="p-3 mx-2 rounded-2xl max-w-4xl flex flex-col gap-2 overflow-x-auto message message-{role} {role === 'user' ? 'preset-filled-primary-200-800' : 'preset-filled-surface-200-800'}"
  >
    {@html cleanHtml}
  </div>
</div>

<style>
  .message :global(pre) {
    background-color: rgb(var(--color-surface-900));
    color: rgb(var(--color-surface-50));
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
    background-color: rgb(var(--color-surface-900));
    color: rgb(var(--color-surface-50));
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
    border-top-right-radius: 0;
  }

  .message-user::after {
    left: auto;
    right: 0;
    border-color: rgb(var(--color-primary-200)) transparent transparent;
  }

  .message-assistant {
    border-top-left-radius: 0;
  }

  .message-assistant::after {
    left: 0;
    right: auto;
    border-color: rgb(var(--color-surface-200)) transparent transparent;
  }

  @media (prefers-color-scheme: dark) {
    .message-user::after {
      border-color: rgb(var(--color-primary-800)) transparent transparent
    }

      .message-assistant::after {
      border-color: rgb(var(--color-surface-800)) transparent transparent;
    }
  }
</style>
