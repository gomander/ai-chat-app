<script lang="ts">
  import { MediaQuery } from 'svelte/reactivity'
  import chatsStore from '$lib/stores/chats.svelte'
  import Drawer from '$lib/components/Drawer.svelte'
  import Icon from '$lib/components/Icon.svelte'

  let { children, data } = $props()

  const large = new MediaQuery('min-width: 1024px')

  let drawerOpen = $state(large.current)

  chatsStore.chats = data.chats

  $effect(() => {
    localStorage.setItem('chats', JSON.stringify(chatsStore.chats))
  })
</script>

<Drawer bind:open={drawerOpen} />

<div class="h-screen flex flex-col">
  <button
    onclick={() => drawerOpen = !drawerOpen}
    class="btn-icon preset-filled-surface-100-900 fixed top-1 left-1 z-10"
    title="Menu"
    aria-label="Open menu"
  >
    <Icon name="menu" />
  </button>

  <main class="flex-1 flex flex-col h-px {drawerOpen && large.current ? 'pl-80' : ''}">
    {@render children()}
  </main>
</div>
