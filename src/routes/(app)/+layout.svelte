<script lang="ts">
  import { onMount } from 'svelte'
  import chatsStore from '$lib/stores/chats.svelte'
  import Drawer from '$lib/components/Drawer.svelte'
  import Icon from '$lib/components/Icon.svelte'

  let { children, data } = $props()
  let drawerOpen = $state(false)

  onMount(() => {
    chatsStore.chats = data.chats
  })
</script>

<Drawer bind:open={drawerOpen} />

<div class="h-screen flex flex-col">
  <button
    onclick={() => drawerOpen = !drawerOpen}
    class="btn-icon variant-glass fixed top-2 left-2 z-10"
    title="Menu"
    aria-label="Open menu"
  >
    <Icon name="menu" />
  </button>

  <main class="flex-1 flex flex-col px-4 h-px">
    {@render children()}
  </main>
</div>
