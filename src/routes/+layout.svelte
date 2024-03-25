<script>
  import Header from '$lib/components/Header.svelte';
  import '../app.css';
</script>

<div class="app">
  <Header />

  <main>
    <slot />
  </main>

  <footer>
    <p>visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to learn SvelteKit</p>
  </footer>
</div>
