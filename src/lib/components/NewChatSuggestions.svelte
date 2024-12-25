<script lang="ts">
  import chatSuggestions from '$lib/data/suggestions'

  let { onSelectSuggestion } = $props<{
    onSelectSuggestion: (message: string) => void
  }>()
</script>

{#each chatSuggestions as suggestion}
  <button
    class="btn preset-tonal-primary p-4"
    onclick={() => onSelectSuggestion(suggestion.message)}
  >
    {suggestion.label}
  </button>
{/each}
