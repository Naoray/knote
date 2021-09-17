<template>
  <div class="flex justify-center">
    <textarea v-if="!showRendered" ref="editor" class="flex-1 prose xl:prose-lg xl:max-w-5xl focus:outline-none" v-model="content"></textarea>
    <div v-else @click="focusOnEditor" class="flex-1 prose-sm prose lg:prose xl:prose-lg xl:max-w-5xl focus:outline-none" v-html="renderedContent"></div>
  </div>
</template>

<script lang="ts">
import { defineComponent, nextTick, ref, watch } from 'vue'

import { useNotes } from '../hooks/notes'
import { useRoute, useRouter } from 'vue-router'
import { useBroadcasts } from '../hooks/broadcasts'
import { useMarkdown } from '../hooks/markdown'
import { Note } from '@/shared/types'

export default defineComponent({
  setup () {
    const { editor: editorBroadcast } = useBroadcasts()!
    const { toHtml } = useMarkdown()!

    const showRendered = ref(true)
    watch(editorBroadcast, () => (showRendered.value = !showRendered.value))

    const content = ref('')
    const renderedContent = ref('')

    const { currentNoteContent, data, currentNote } = useNotes()!
    const route = useRoute()
    const router = useRouter()

    const getCurrentNoteContent = () => {
      content.value = currentNoteContent(String(route.params.note))
      renderedContent.value = toHtml(content.value)
    }

    // set first file content on initial load
    getCurrentNoteContent()

    // set content on project change
    watch(data, getCurrentNoteContent)

    // set new file content on note change
    watch(() => route.params.note, () => {
      getCurrentNoteContent()
      showRendered.value = true
    })

    watch(content, current => {
      const note = currentNote(String(route.params.note))
      if (note === undefined) return
      note.content = current
      renderedContent.value = toHtml(current)
    })

    const presentModeEnabled = ref(false)
    window.ipc.on('togglePresentMode', (enabled: boolean) => (presentModeEnabled.value = enabled))

    window.ipc.on('save', () => {
      const note = currentNote(String(route.params.note))
      window.ipc.send('save', {
        content: note.content,
        fileName: note.fileName,
      })
    })

    const editor = ref<HTMLTextAreaElement | null>(null)
    window.ipc.on('newNote', (newNote: Note) => {
      router.push({ name: 'NoteEditor', params: { note: newNote.key } })
      nextTick(() => editor.value?.focus())
    })

    return {
      content,
      renderedContent,
      showRendered,
      editor,
      focusOnEditor: () => {
        if (presentModeEnabled.value) return
        showRendered.value = false
        nextTick(() => {
          if (editor.value === null) return

          editor.value.focus()
        })
      },
    }
  },
})
</script>
