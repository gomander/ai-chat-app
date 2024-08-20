<script lang="ts">
  import chatsStore from '$lib/stores/chats.svelte'
  import Drawer from '$lib/components/Drawer.svelte'
  import Icon from '$lib/components/Icon.svelte'

  let { children, data } = $props()
  let drawerOpen = $state(false)

  chatsStore.chats = data.chats

  $effect(() => {
    localStorage.setItem('chats', JSON.stringify(chatsStore.chats))
  })
</script>

<Drawer bind:open={drawerOpen} />

<div class="h-screen flex flex-col">
  <button
    onclick={() => drawerOpen = !drawerOpen}
    class="btn-icon preset-tonal fixed top-2 left-2 z-10"
    title="Menu"
    aria-label="Open menu"
  >
    <Icon name="menu" />
  </button>

  <main class="flex-1 flex flex-col h-px">
    {@render children()}
  </main>
</div>
