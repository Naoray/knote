<template>
  <div class="flex justify-center">
    <textarea v-if="!showRendered" ref="editor" class="flex-1 prose xl:prose-lg xl:max-w-5xl focus:outline-none" v-model="content"></textarea>
    <div v-else @click="focusOnEditor" class="flex-1 prose-sm prose lg:prose xl:prose-lg xl:max-w-5xl focus:outline-none" v-html="renderedContent"></div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue'

import { useNotes } from '../hooks/notes'
import { onBeforeRouteLeave, useRoute, useRouter } from 'vue-router'
import { useBroadcasts } from '../hooks/broadcasts'
import { useMarkdown } from '../hooks/markdown'
import { Note } from '@/shared/types'
import { debounce } from '@/shared/utils'

export default defineComponent({
  setup () {
    const { editor: editorBroadcast, settings } = useBroadcasts()!
    const { toHtml } = useMarkdown()!

    const showRendered = ref(true)
    watch(editorBroadcast, () => (showRendered.value = !showRendered.value))

    const content = ref('')
    const renderedContent = ref('')

    const { currentNoteContent, data, currentNote, removeNote } = useNotes()!
    const route = useRoute()
    const router = useRouter()

    const getCurrentNoteContent = () => {
      content.value = currentNoteContent(String(route.params.note))
      renderedContent.value = toHtml(content.value)
    }

    const saveCurrentNote = () => {
      const note = currentNote(String(route.params.note))
      return window.ipc.send('save', Object.assign({}, note))
    }

    onBeforeRouteLeave((to, from, next) => {
      if (settings.enableAutosaving) saveCurrentNote()

      next()
    })

    // set first file content on initial load
    getCurrentNoteContent()

    // set content on project change
    watch(data, getCurrentNoteContent)

    // set new file content on note change
    watch(() => route.params.note, () => {
      getCurrentNoteContent()
      showRendered.value = true
    })

    watch(content, debounce(current => {
      const note = currentNote(String(route.params.note))
      if (note === undefined) return
      note.content = current
      const htmlContent = toHtml(current)
      const contentHasChanged = htmlContent !== renderedContent.value
      renderedContent.value = htmlContent

      if (note.fileName && contentHasChanged && settings.enableAutosaving) saveCurrentNote()
    }))

    const presentModeEnabled = ref(false)
    window.ipc.on('togglePresentMode', (enabled: boolean) => {
      presentModeEnabled.value = enabled
      if (enabled) showRendered.value = true
    })

    window.ipc.on('save', saveCurrentNote)

    window.ipc.on('removeNote', () => {
      const key = String(route.params.note)
      const note = currentNote(key)
      const prevIndex = data.value.findIndex(item => item.key === key)
      removeNote(key)
      const previousNote = data.value[prevIndex === 0 ? 0 : prevIndex - 1]
      window.ipc.send('removedNote', Object.assign({}, note))

      if (previousNote) router.push({ name: 'NoteEditor', params: { note: previousNote.key } })
      else router.push({ name: 'Home' })
    })

    const editor = ref<HTMLTextAreaElement | null>(null)
    window.ipc.on('newNote', (newNote: Note) => {
      router.push({ name: 'NoteEditor', params: { note: newNote.key } })
    })

    return {
      content,
      renderedContent,
      showRendered,
      editor,
      focusOnEditor: () => {
        if (presentModeEnabled.value) return
        showRendered.value = false
      },
    }
  },
})
</script>
