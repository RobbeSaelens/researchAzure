import { defineConfig } from 'vite'

import vue from '@vitejs/plugin-vue'
import Unocss from 'unocss/vite'

export default defineConfig({
  build: {},

  server: {
    host: '0.0.0.0',
  },

  plugins: [
    vue(),

    Unocss({
      rules: [['font-theme', { 'font-family': 'din-condensed, sans-serif;' }]],
      theme: {
        colors: {
          grey: '#564d4d',
          netflix: '#db0000',
          bordeaux: '#831010',
        },
      },
    }),
  ],
})
