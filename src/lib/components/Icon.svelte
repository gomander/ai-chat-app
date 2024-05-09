<script lang="ts">
  import icons from '$lib/data/icons'

  let { name, size = 25, color = 'currentColor' }: {
    name: keyof typeof icons,
    size?: number,
    color?: string
  } = $props()
</script>

<svg
  xmlns="http://www.w3.org/2000/svg"
  viewBox="0 -960 960 960"
  width={size}
  height={size}
  class="pointer-events-none"
>
  <title>{name}</title>
  <path
    fill={color}
    d={icons[name]}
  />
</svg>
