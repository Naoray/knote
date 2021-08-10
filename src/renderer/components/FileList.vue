<template>
  <ul class="divide-y divide-gray-200">
    <router-link :to="{ name: 'NoteEditor', params: {note: note.key}}" v-for="note in notes" :key="note.key" custom v-slot="{ navigate, isActive }">
      <li :key="note.key" @click="navigate" :class="[isActive && 'bg-indigo-50']" class="relative px-4 py-5 bg-white hover:bg-gray-50 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600">
        <div class="flex justify-between space-x-3">
          <div class="flex-1 min-w-0">
            <a href="#" class="block focus:outline-none">
              <span class="absolute inset-0" aria-hidden="true" />
              <p class="text-sm font-medium text-gray-900 truncate">{{ note.title }}</p>
            </a>
          </div>
          <time :datetime="note.datetime" class="flex-shrink-0 text-sm text-gray-500 whitespace-nowrap">{{ note.time }}</time>
        </div>
        <div class="mt-1">
          <p class="text-sm text-gray-600 line-clamp-2">
            {{ note.content }}
          </p>
        </div>
      </li>
    </router-link>
  </ul>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useNotes } from '../hooks/notes'

export default defineComponent({
  setup () {
    const notes = useNotes()!

    return {
      notes: notes.data
    }
  }
})
</script>
