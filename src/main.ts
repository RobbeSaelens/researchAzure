import { App as VueApp, createApp } from 'vue'

import '@unocss/reset/tailwind.css'
import 'uno.css'

import App from './App.vue'

const app: VueApp = createApp(App)

;(async function () {
  app.mount('#app')
})()
