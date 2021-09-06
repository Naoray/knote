import { Note } from '@/shared/types'
import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Start.vue'),
  },
  {
    path: '/notes/:note',
    name: 'NoteEditor',
    component: () => import('../views/Editor.vue'),
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

window.ipc.on('openProject', (note: Note) => {
  window.ipc.send('request-files')
  router.push({ name: 'NoteEditor', params: { note: note.key } })
})

export default router
