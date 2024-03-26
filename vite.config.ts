import { defineConfig } from 'vite'
import { sveltekit } from '@sveltejs/kit/vite'
import { purgeCss } from 'vite-plugin-tailwind-purgecss'

export default defineConfig({
	plugins: [sveltekit(), purgeCss()]
})
