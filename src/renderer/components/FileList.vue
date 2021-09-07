<template>
  <ul class="divide-y divide-gray-200">
    <router-link :to="{ name: 'NoteEditor', params: {note: note.key}}" v-for="note in notes" :key="note.key" custom v-slot="{ navigate, isActive }">
      <li :key="note.key" @click="navigate" :class="[isActive && 'bg-indigo-50']" class="relative px-4 py-5 bg-white cursor-pointer hover:bg-gray-50 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600">
        <div class="flex flex-col justify-between">
          <h2 class="font-semibold text-gray-700">{{ extractTitle(note.content) }}</h2>
          <time :datetime="note.datetime" class="flex-shrink-0 text-xs text-gray-500 whitespace-nowrap">{{ note.datetime }}</time>
        </div>
        <div class="mt-1">
          <p class="text-sm text-gray-600 line-clamp-2" v-html="toHtml(contentWithoutTitle(note.content))">
          </p>
        </div>
      </li>
    </router-link>
  </ul>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useMarkdown } from '../hooks/markdown'
import { useNotes } from '../hooks/notes'

export default defineComponent({
  setup () {
    const notes = useNotes()!
    const { extractTitle, toHtml, contentWithoutTitle } = useMarkdown()!

    return {
      contentWithoutTitle,
      extractTitle,
      toHtml,
      notes: notes.data,
    }
  },
})
</script>
