/** @type {import('tailwindcss').Config} */

const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', ...defaultTheme.fontFamily.sans],
        mono: ['Fira Code', ...defaultTheme.fontFamily.mono],
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            color: theme('colors.zinc[50]'),
            fontWeight: '300',
            a: {
              color: theme('colors.emerald[300]'),
              '&:hover': {
                color: theme('colors.emerald[200]'),
              },
              textDecoration: 'none',
            },
            code: {
              '&::before': {
                display: 'none',
              },
              '&::after': {
                display: 'none',
              },
              fontWeight: '300',
              paddingLeft: '2px',
              paddingRight: '2px',
              color: theme('colors.blue[100]'),
              backgroundColor: theme('colors.zinc[900]'),
              borderRadius: '4px',
            },
            blockquote: {
              fontStyle: 'none',
              quotes: 'none',
              fontWeight: '300',
              color: theme('colors.blue[200]'),
              borderLeftColor: theme('colors.blue[300]'),
            },
          },
        },
      }),
    },
  },
  plugins: [require('@tailwindcss/typography')],
}
