<script lang="ts">
  import { spring } from 'svelte/motion'

  let count = $state(0)
  const displayed_count = spring()
  $effect(() => displayed_count.set(count))
  let offset = $derived((($displayed_count % 1) + 1) % 1)
</script>

<div class="counter">
  <button on:click={() => (count -= 1)} aria-label="Decrease the counter by one">
    <svg aria-hidden="true" viewBox="0 0 1 1">
      <path d="M0,0.5 L1,0.5" />
    </svg>
  </button>

  <div class="counter-viewport">
    <div class="counter-digits" style="transform: translate(0, {100 * offset}%)">
      <strong class="hidden" aria-hidden="true">{Math.floor($displayed_count + 1)}</strong>
      <strong>{Math.floor($displayed_count)}</strong>
    </div>
  </div>

  <button on:click={() => (count++)} aria-label="Increase the counter by one">
    <svg aria-hidden="true" viewBox="0 0 1 1">
      <path d="M0,0.5 L1,0.5 M0.5,0 L0.5,1" />
    </svg>
  </button>
</div>
