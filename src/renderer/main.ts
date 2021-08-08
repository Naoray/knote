import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './assets/tailwind.css'
import notes from './hooks/notes'

createApp(App)
  .use(router)
  .use(notes)
  .mount('#app')
