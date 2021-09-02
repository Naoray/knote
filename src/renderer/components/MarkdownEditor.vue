<template>
  <div class="flex">
    <textarea v-if="!showRendered" ref="editor" class="flex-1 prose max-w-none focus:outline-none" v-model="content"></textarea>
    <div v-else @click="focusOnEditor" class="flex-1 prose-sm prose lg:prose-m xl:prose-lg focus:outline-none max-w-none" v-html="renderedContent"></div>
  </div>
</template>

<script lang="ts">
import { defineComponent, nextTick, ref, watch } from 'vue'

import { useNotes } from '../hooks/notes'
import { useRoute } from 'vue-router'
import { createMarkdown } from '@/shared/markdown'
import { useBroadcasts } from '../hooks/broadcasts'

export default defineComponent({
  setup () {
    const { editor: editorBroadcast } = useBroadcasts()!

    const showRendered = ref(true)
    watch(editorBroadcast, values => (showRendered.value = values.showRenderedMarkdown))

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
    watch(() => route.params.note, () => {
      getCurrentNoteContent()
      showRendered.value = true
    })

    watch(content, current => (renderedContent.value = markdown.toHtml(current)))

    window.ipc.on('save', () => window.ipc.send('save', content.value))

    const editor = ref<HTMLTextAreaElement | null>(null)

    return {
      content,
      renderedContent,
      showRendered,
      editor,
      focusOnEditor: () => {
        showRendered.value = false
        nextTick(() => {
          if (editor.value === null) return

          editor.value.focus()
        })
      }
    }
  }
})
</script>
