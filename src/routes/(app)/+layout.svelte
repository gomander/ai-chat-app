<script lang="ts">
  import ChatOptionsDialog from '$lib/components/ChatOptionsDialog.svelte'
  import Drawer from '$lib/components/Drawer.svelte'
  import Icon from '$lib/components/Icon.svelte'

  let { children } = $props()
  let drawerOpen = $state(false)
  let optionsOpen = $state(false)
</script>

<Drawer bind:open={drawerOpen} onOpenOptionsDialog={() => optionsOpen = true} />
<ChatOptionsDialog bind:open={optionsOpen} />

<div class="h-screen flex flex-col">
  <button
    onclick={() => drawerOpen = !drawerOpen}
    class="btn-icon variant-glass fixed top-2 left-2 z-10"
    title="Menu"
    aria-label="Open menu"
  >
    <Icon name="menu" />
  </button>

  <button
    onclick={() => optionsOpen = true}
    class="btn-icon variant-glass fixed top-2 right-2 z-10"
    title="Settings"
    aria-label="Open settings"
  >
    <Icon name="settings" />
  </button>

  <main class="flex-1 flex flex-col px-4 pb-2 h-px">
    {@render children()}
  </main>
</div>
