<template>
  <div class="flex">
    <textarea class="w-1/2 mx-10 prose-sm prose lg:prose-m xl:prose-lg focus:outline-none" v-model="content"></textarea>
    <div class="w-1/2 mx-10 prose-sm prose lg:prose-m xl:prose-lg focus:outline-none" v-html="renderedContent"></div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue'

import { useNotes } from '../hooks/notes'
import { useRoute } from 'vue-router'
import { createMarkdown } from '@/shared/markdown'

export default defineComponent({
  setup () {
    const markdown = createMarkdown('commonmark', {
      html: true,
      linkify: true,
      breaks: true,
      typographer: true
    })

    const content = ref('')
    const renderedContent = ref('')

    const { currentNoteContent } = useNotes()!
    const route = useRoute()

    const getCurrentNoteContent = () => {
      content.value = currentNoteContent(String(route.params.note))
      renderedContent.value = markdown.toHtml(content.value)
    }

    // set first file content on initial load
    window.ipc.on('requested-files', getCurrentNoteContent)

    // set new file content on note change
    watch(() => route.params.note, getCurrentNoteContent)
    watch(content, current => (renderedContent.value = markdown.toHtml(current)))

    window.ipc.on('save', () => window.ipc.send('save', content.value))

    return { content, renderedContent }
  }
})
</script>
