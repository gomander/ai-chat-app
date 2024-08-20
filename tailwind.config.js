import forms from '@tailwindcss/forms'
import typography from '@tailwindcss/typography'
import { skeleton } from '@skeletonlabs/skeleton/plugin'
import * as themes from '@skeletonlabs/skeleton/themes'

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'media',
  content: ['./src/**/*.{html,js,svelte,ts}'],
  plugins: [
    forms,
    typography,
    skeleton({ themes: [themes.cerberus, themes.catppuccin, themes.pine, themes.rose] })
  ]
}
