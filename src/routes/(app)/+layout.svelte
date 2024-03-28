<script lang="ts">
  let { children } = $props()
</script>

<div class="h-screen grid grid-rows-[auto_1fr]">
  <header class="flex gap-4 items-center variant-filled-secondary p-4">
    <button class="btn-icon variant-filled-primary">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 -960 960 960"
        width="24"
        height="24"
      >
        <path d="M160-240q-17 0-28.5-11.5T120-280q0-17 11.5-28.5T160-320h640q17 0 28.5 11.5T840-280q0 17-11.5 28.5T800-240H160Zm0-200q-17 0-28.5-11.5T120-480q0-17 11.5-28.5T160-520h640q17 0 28.5 11.5T840-480q0 17-11.5 28.5T800-440H160Zm0-200q-17 0-28.5-11.5T120-680q0-17 11.5-28.5T160-720h640q17 0 28.5 11.5T840-680q0 17-11.5 28.5T800-640H160Z" />
      </svg>
    </button>

    <h1 class="text-2xl">Chatbot</h1>
  </header>

  <!-- <nav class="variant-filled-surface w-64">
    <ul class="flex flex-col gap-2 p-2 md:p-4">
      <li>
        <a href="/">Home</a>
      </li>
      <li>
        <a href="/about">About</a>
      </li>
    </ul>
  </nav> -->

  <main class="flex flex-col p-2 md:p-4 min-h-px">
    {@render children()}
  </main>
</div>
