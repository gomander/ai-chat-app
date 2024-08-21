import type { Config } from 'tailwindcss'
import forms from '@tailwindcss/forms'
import typography from '@tailwindcss/typography'
import { skeleton } from '@skeletonlabs/skeleton/plugin'
import customTheme from './custom-theme'

const config: Config = {
  darkMode: 'media',
  content: ['./src/**/*.{html,js,svelte,ts}'],
  plugins: [forms, typography, skeleton({ themes: [customTheme] })]
}

export default config
