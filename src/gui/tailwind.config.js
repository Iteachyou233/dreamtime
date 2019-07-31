// See default config https://github.com/tailwindcss/tailwindcss/blob/master/stubs/defaultConfig.stub.js
module.exports = {
  theme: {
    extend: {
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          'Nunito',
          'Nunito Sans',
          'system-ui',
          'Helvetica Neue',
          'Arial',
          'sans-serif'
        ]
      },

      colors: {
        generic: {
          default: '#797786',
          600: '#a09caf'
        },

        dark: {
          100: '#7A7884',
          200: '#676473',
          300: '#545161',
          400: '#413E50',
          default: '#2f2b3f',
          600: '#2B283A',
          700: '#272434',
          800: '#231f2f',
          900: '#1E1C29'
        },

        blue: {
          default: '#2eb9e7'
        },

        violet: {
          default: '#7020ea'
        },

        pink: {
          default: '#ef98d0'
        },

        danger: {
          10: 'rgba(244, 67, 54, 0.10)',
          15: 'rgba(244, 67, 54, 0.15)',
          20: 'rgba(244, 67, 54, 0.20)',
          25: 'rgba(244, 67, 54, 0.25)',
          default: '#f44336'
        },

        success: {
          10: 'rgba(87, 184, 70, 0.10)',
          20: 'rgba(87, 184, 70, 0.20)',
          default: '#57b846'
        },

        warning: '#c17c16',

        primary: {
          10: 'rgba(77, 124, 254, 0.10)',
          15: 'rgba(77, 124, 254, 0.15)',
          20: 'rgba(77, 124, 254, 0.20)',
          25: 'rgba(77, 124, 254, 0.25)',
          100: '#7D9FFE',
          200: '#6D93FE',
          300: '#5D87FE',
          default: '#ec6e81',
          500: '#4671E7',
          600: '#4066D0',
          700: '#395BB9',
          800: '#324FA2',
          900: '#2A448B'
        }
      }
    }
  },
  variants: {}
}
