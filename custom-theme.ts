import type { Theme } from '@skeletonlabs/skeleton/plugin'

const theme: Theme = {
	name: 'custom',
	properties: {
		'--space-scale-factor': '1',
		'--type-scale-factor': '1.125',
		'--type-scale-1': 'calc(0.75rem * var(--type-scale-factor))',
		'--type-scale-2': 'calc(0.875rem * var(--type-scale-factor))',
		'--type-scale-3': 'calc(1rem * var(--type-scale-factor))',
		'--type-scale-4': 'calc(1.125rem * var(--type-scale-factor))',
		'--type-scale-5': 'calc(1.25rem * var(--type-scale-factor))',
		'--type-scale-6': 'calc(1.5rem * var(--type-scale-factor))',
		'--type-scale-7': 'calc(1.875rem * var(--type-scale-factor))',
		'--type-scale-8': 'calc(2.25rem * var(--type-scale-factor))',
		'--type-scale-9': 'calc(3rem * var(--type-scale-factor))',
		'--type-scale-10': 'calc(3.75rem * var(--type-scale-factor))',
		'--type-scale-11': 'calc(4.5rem * var(--type-scale-factor))',
		'--type-scale-12': 'calc(6rem * var(--type-scale-factor))',
		'--type-scale-13': 'calc(8rem * var(--type-scale-factor))',
		'--base-font-color': 'var(--color-surface-600)',
		'--base-font-color-dark': 'var(--color-surface-50)',
		'--base-font-family': 'system-ui',
		'--base-font-size': 'inherit',
		'--base-line-height': 'inherit',
		'--base-font-weight': 'normal',
		'--base-font-style': 'normal',
		'--base-letter-spacing': '0em',
		'--heading-font-color': 'var(--color-tertiary-500)',
		'--heading-font-color-dark': 'var(--color-secondary-50)',
		'--heading-font-family': 'inherit',
		'--heading-font-weight': 'bolder',
		'--heading-font-style': 'normal',
		'--heading-letter-spacing': 'inherit',
		'--anchor-font-color': 'var(--color-secondary-600)',
		'--anchor-font-color-dark': 'var(--color-tertiary-400)',
		'--anchor-font-family': 'inherit',
		'--anchor-font-size': 'inherit',
		'--anchor-line-height': 'inherit',
		'--anchor-font-weight': 'normal',
		'--anchor-font-style': 'normal',
		'--anchor-letter-spacing': 'inherit',
		'--anchor-text-decoration': 'none',
		'--anchor-text-decoration-hover': 'underline',
		'--anchor-text-decoration-active': 'none',
		'--anchor-text-decoration-focus': 'none',
		'--body-background-color': '255 255 255',
		'--body-background-color-dark': 'var(--color-surface-950)',
		'--radii-default': '8px',
		'--radii-container': '16px',
		'--border-width-default': '1px',
		'--ring-width-default': '1px',
		'--outline-width-default': '1px',
		'--divide-width-default': '1px',
		'--color-primary-50': '224 228 255',
		'--color-primary-100': '202 209 255',
		'--color-primary-200': '180 191 254',
		'--color-primary-300': '158 172 254',
		'--color-primary-400': '136 154 253',
		'--color-primary-500': '114 135 253',
		'--color-primary-600': '102 120 222',
		'--color-primary-700': '90 105 192',
		'--color-primary-800': '77 89 161',
		'--color-primary-900': '65 74 131',
		'--color-primary-950': '53 59 100',
		'--color-primary-contrast-dark': 'var(--color-primary-950)',
		'--color-primary-contrast-light': 'var(--color-primary-50)',
		'--color-primary-contrast-50': 'var(--color-primary-contrast-dark)',
		'--color-primary-contrast-100': 'var(--color-primary-contrast-dark)',
		'--color-primary-contrast-200': 'var(--color-primary-contrast-dark)',
		'--color-primary-contrast-300': 'var(--color-primary-contrast-dark)',
		'--color-primary-contrast-400': 'var(--color-primary-contrast-dark)',
		'--color-primary-contrast-500': 'var(--color-primary-contrast-light)',
		'--color-primary-contrast-600': 'var(--color-primary-contrast-light)',
		'--color-primary-contrast-700': 'var(--color-primary-contrast-light)',
		'--color-primary-contrast-800': 'var(--color-primary-contrast-light)',
		'--color-primary-contrast-900': 'var(--color-primary-contrast-light)',
		'--color-primary-contrast-950': 'var(--color-primary-contrast-light)',
		'--color-secondary-50': '245 194 231',
		'--color-secondary-100': '243 179 225',
		'--color-secondary-200': '241 164 220',
		'--color-secondary-300': '238 148 214',
		'--color-secondary-400': '236 133 209',
		'--color-secondary-500': '234 118 203',
		'--color-secondary-600': '207 105 180',
		'--color-secondary-700': '181 92 158',
		'--color-secondary-800': '154 78 135',
		'--color-secondary-900': '128 65 113',
		'--color-secondary-950': '101 52 90',
		'--color-secondary-contrast-dark': 'var(--color-secondary-950)',
		'--color-secondary-contrast-light': 'var(--color-secondary-50)',
		'--color-secondary-contrast-50': 'var(--color-secondary-contrast-dark)',
		'--color-secondary-contrast-100': 'var(--color-secondary-contrast-dark)',
		'--color-secondary-contrast-200': 'var(--color-secondary-contrast-dark)',
		'--color-secondary-contrast-300': 'var(--color-secondary-contrast-dark)',
		'--color-secondary-contrast-400': 'var(--color-secondary-contrast-dark)',
		'--color-secondary-contrast-500': 'var(--color-secondary-contrast-dark)',
		'--color-secondary-contrast-600': 'var(--color-secondary-contrast-dark)',
		'--color-secondary-contrast-700': 'var(--color-secondary-contrast-light)',
		'--color-secondary-contrast-800': 'var(--color-secondary-contrast-light)',
		'--color-secondary-contrast-900': 'var(--color-secondary-contrast-light)',
		'--color-secondary-contrast-950': 'var(--color-secondary-contrast-light)',
		'--color-tertiary-50': '148 226 213',
		'--color-tertiary-100': '123 210 201',
		'--color-tertiary-200': '98 194 189',
		'--color-tertiary-300': '73 178 177',
		'--color-tertiary-400': '48 162 165',
		'--color-tertiary-500': '23 146 153',
		'--color-tertiary-600': '22 130 135',
		'--color-tertiary-700': '20 114 118',
		'--color-tertiary-800': '19 98 100',
		'--color-tertiary-900': '17 82 83',
		'--color-tertiary-950': '16 66 65',
		'--color-tertiary-contrast-dark': 'var(--color-tertiary-950)',
		'--color-tertiary-contrast-light': 'var(--color-tertiary-50)',
		'--color-tertiary-contrast-50': 'var(--color-tertiary-contrast-dark)',
		'--color-tertiary-contrast-100': 'var(--color-tertiary-contrast-dark)',
		'--color-tertiary-contrast-200': 'var(--color-tertiary-contrast-dark)',
		'--color-tertiary-contrast-300': 'var(--color-tertiary-contrast-dark)',
		'--color-tertiary-contrast-400': 'var(--color-tertiary-contrast-dark)',
		'--color-tertiary-contrast-500': 'var(--color-tertiary-contrast-light)',
		'--color-tertiary-contrast-600': 'var(--color-tertiary-contrast-light)',
		'--color-tertiary-contrast-700': 'var(--color-tertiary-contrast-light)',
		'--color-tertiary-contrast-800': 'var(--color-tertiary-contrast-light)',
		'--color-tertiary-contrast-900': 'var(--color-tertiary-contrast-light)',
		'--color-tertiary-contrast-950': 'var(--color-tertiary-contrast-light)',
		'--color-success-50': '166 227 161',
		'--color-success-100': '146 214 137',
		'--color-success-200': '125 200 114',
		'--color-success-300': '105 187 90',
		'--color-success-400': '84 173 67',
		'--color-success-500': '64 160 43',
		'--color-success-600': '57 144 43',
		'--color-success-700': '50 127 42',
		'--color-success-800': '43 111 42',
		'--color-success-900': '36 94 41',
		'--color-success-950': '29 78 41',
		'--color-success-contrast-dark': 'var(--color-success-950)',
		'--color-success-contrast-light': 'var(--color-success-50)',
		'--color-success-contrast-50': 'var(--color-success-contrast-dark)',
		'--color-success-contrast-100': 'var(--color-success-contrast-dark)',
		'--color-success-contrast-200': 'var(--color-success-contrast-dark)',
		'--color-success-contrast-300': 'var(--color-success-contrast-dark)',
		'--color-success-contrast-400': 'var(--color-success-contrast-dark)',
		'--color-success-contrast-500': 'var(--color-success-contrast-light)',
		'--color-success-contrast-600': 'var(--color-success-contrast-light)',
		'--color-success-contrast-700': 'var(--color-success-contrast-light)',
		'--color-success-contrast-800': 'var(--color-success-contrast-light)',
		'--color-success-contrast-900': 'var(--color-success-contrast-light)',
		'--color-success-contrast-950': 'var(--color-success-contrast-light)',
		'--color-warning-50': '249 226 175',
		'--color-warning-100': '244 209 146',
		'--color-warning-200': '239 192 117',
		'--color-warning-300': '233 176 87',
		'--color-warning-400': '228 159 58',
		'--color-warning-500': '223 142 29',
		'--color-warning-600': '199 128 28',
		'--color-warning-700': '174 115 28',
		'--color-warning-800': '150 101 27',
		'--color-warning-900': '125 88 27',
		'--color-warning-950': '101 74 26',
		'--color-warning-contrast-dark': 'var(--color-warning-950)',
		'--color-warning-contrast-light': 'var(--color-warning-50)',
		'--color-warning-contrast-50': 'var(--color-warning-contrast-dark)',
		'--color-warning-contrast-100': 'var(--color-warning-contrast-dark)',
		'--color-warning-contrast-200': 'var(--color-warning-contrast-dark)',
		'--color-warning-contrast-300': 'var(--color-warning-contrast-dark)',
		'--color-warning-contrast-400': 'var(--color-warning-contrast-dark)',
		'--color-warning-contrast-500': 'var(--color-warning-contrast-dark)',
		'--color-warning-contrast-600': 'var(--color-warning-contrast-light)',
		'--color-warning-contrast-700': 'var(--color-warning-contrast-light)',
		'--color-warning-contrast-800': 'var(--color-warning-contrast-light)',
		'--color-warning-contrast-900': 'var(--color-warning-contrast-light)',
		'--color-warning-contrast-950': 'var(--color-warning-contrast-light)',
		'--color-error-50': '243 139 168',
		'--color-error-100': '236 114 146',
		'--color-error-200': '230 89 124',
		'--color-error-300': '223 65 101',
		'--color-error-400': '217 40 79',
		'--color-error-500': '210 15 57',
		'--color-error-600': '188 16 55',
		'--color-error-700': '167 17 52',
		'--color-error-800': '145 19 50',
		'--color-error-900': '124 20 47',
		'--color-error-950': '102 21 45',
		'--color-error-contrast-dark': 'var(--color-error-950)',
		'--color-error-contrast-light': 'var(--color-error-50)',
		'--color-error-contrast-50': 'var(--color-error-contrast-dark)',
		'--color-error-contrast-100': 'var(--color-error-contrast-dark)',
		'--color-error-contrast-200': 'var(--color-error-contrast-dark)',
		'--color-error-contrast-300': 'var(--color-error-contrast-dark)',
		'--color-error-contrast-400': 'var(--color-error-contrast-dark)',
		'--color-error-contrast-500': 'var(--color-error-contrast-light)',
		'--color-error-contrast-600': 'var(--color-error-contrast-light)',
		'--color-error-contrast-700': 'var(--color-error-contrast-light)',
		'--color-error-contrast-800': 'var(--color-error-contrast-light)',
		'--color-error-contrast-900': 'var(--color-error-contrast-light)',
		'--color-error-contrast-950': 'var(--color-error-contrast-light)',
		'--color-surface-50': '248 250 255',
		'--color-surface-100': '225 228 240',
		'--color-surface-200': '206 209 224',
		'--color-surface-300': '186 191 209',
		'--color-surface-400': '167 172 193',
		'--color-surface-500': '147 153 178',
		'--color-surface-600': '123 128 151',
		'--color-surface-700': '99 103 124',
		'--color-surface-800': '75 79 97',
		'--color-surface-900': '51 54 70',
		'--color-surface-950': '27 29 43',
		'--color-surface-contrast-dark': 'var(--color-surface-950)',
		'--color-surface-contrast-light': 'var(--color-surface-50)',
		'--color-surface-contrast-50': 'var(--color-surface-contrast-dark)',
		'--color-surface-contrast-100': 'var(--color-surface-contrast-dark)',
		'--color-surface-contrast-200': 'var(--color-surface-contrast-dark)',
		'--color-surface-contrast-300': 'var(--color-surface-contrast-dark)',
		'--color-surface-contrast-400': 'var(--color-surface-contrast-dark)',
		'--color-surface-contrast-500': 'var(--color-surface-contrast-light)',
		'--color-surface-contrast-600': 'var(--color-surface-contrast-light)',
		'--color-surface-contrast-700': 'var(--color-surface-contrast-light)',
		'--color-surface-contrast-800': 'var(--color-surface-contrast-light)',
		'--color-surface-contrast-900': 'var(--color-surface-contrast-light)',
		'--color-surface-contrast-950': 'var(--color-surface-contrast-light)'
	}
}

export default theme
