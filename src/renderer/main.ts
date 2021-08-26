import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './assets/tailwind.css'

import notes from './hooks/notes'
import broadcasts from './hooks/broadcasts'

createApp(App)
  .use(router)
  .use(notes)
  .use(broadcasts)
  .mount('#app')
