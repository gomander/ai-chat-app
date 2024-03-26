<script lang="ts">
  import type { RoleType } from '$types/common'

  let { content, role }: {
    content: string,
    role: RoleType
  } = $props()
</script>

<div class="px-4 py-2 rounded-lg w-fit max-w-prose {role}">
  {content}
</div>

<style lang="postcss">
  .user {
    @apply variant-filled-primary text-right self-end;
  }

  .assistant {
    @apply variant-filled-secondary;
  }
</style>
