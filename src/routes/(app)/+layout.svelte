<script lang="ts">
  import Drawer from '$lib/components/Drawer.svelte'

  let { children } = $props()
  let drawerOpen = $state(false)
</script>

<Drawer bind:open={drawerOpen} />

<div class="h-screen flex flex-col">
  <header class="flex gap-4 items-center bg-surface-100-800-token p-2">
    <button
      onclick={() => drawerOpen = !drawerOpen}
      class="btn-icon variant-soft"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 -960 960 960"
        width="24"
        height="24"
      >
        <path
          fill="white"
          d="M160-240q-17 0-28.5-11.5T120-280q0-17 11.5-28.5T160-320h640q17 0 28.5 11.5T840-280q0 17-11.5 28.5T800-240H160Zm0-200q-17 0-28.5-11.5T120-480q0-17 11.5-28.5T160-520h640q17 0 28.5 11.5T840-480q0 17-11.5 28.5T800-440H160Zm0-200q-17 0-28.5-11.5T120-680q0-17 11.5-28.5T160-720h640q17 0 28.5 11.5T840-680q0 17-11.5 28.5T800-640H160Z"
        />
      </svg>
    </button>

    <h1 class="text-2xl">Chatbot</h1>
  </header>

  <main class="flex-1 flex flex-col px-4 pb-2 h-px">
    {@render children()}
  </main>
</div>
