import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './assets/tailwind.css'

import notes from './hooks/notes'
import broadcasts from './hooks/broadcasts'
import markdown from './hooks/markdown'

createApp(App)
  .use(router)
  .use(notes)
  .use(broadcasts)
  .use(markdown)
  .mount('#app')

window.ipc.send('rendererReady')
