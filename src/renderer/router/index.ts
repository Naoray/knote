import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import Editor from '../views/Editor.vue'
import Start from '../views/Start.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: Start
  },
  {
    path: '/notes/:note',
    name: 'NoteEditor',
    component: Editor
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
