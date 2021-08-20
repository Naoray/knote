<template>
  <div class="flex flex-col items-center max-h-screen min-h-screen mt-32 space-y-8">
    <h2 class="text-5xl font-semibold leading-7 text-gray-900">
      Knote
    </h2>
    <!--<div class="relative z-10 max-w-md py-5 mx-auto">
      <input
        placeholder="Search..."
        autofocus="true"
        class="block w-full px-3 py-2 text-sm leading-5 transition duration-150 ease-in-out border rounded-md appearance-none border-cool-gray-300 text-cool-gray-900 placeholder-cool-gray-400 focus:outline-none focus:shadow-outline-blue focus:border-blue-300"
      />
    </div>-->
    <div>
      <button @click="openProject" type="button" class="inline-flex items-center px-4 py-2 text-base font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 mr-3 -ml-1" aria-hidden="true" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H9a2 2 0 00-2 2v5a2 2 0 01-2 2z" />
        </svg>
        New Project
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Note } from '@/shared/types'
import { useRouter } from 'vue-router'

const router = useRouter()

const openProject = () => {
  window.ipc.on('openProject', (note: Note) => {
    router.push({ name: 'NoteEditor', params: { note: note.key } })
  })

  window.ipc.send('openProject')
}
</script>
