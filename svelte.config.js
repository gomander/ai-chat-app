import adapter from '@sveltejs/adapter-node'
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte'

/** @type {import('@sveltejs/kit').Config} */
export default {
	preprocess: [vitePreprocess()],
	vitePlugin: { inspector: true },
	kit: {
    adapter: adapter(),
    alias: {
      '$types': 'src/types'
    }
  }
}
