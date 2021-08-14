<template>
  <EditorContent :editor="editor" />
</template>

<script lang="ts">
import { defineComponent, watch } from 'vue'

import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Highlight from '@tiptap/extension-highlight'
import { useNotes } from '../hooks/notes'
import { useRoute } from 'vue-router'

export default defineComponent({
  components: {
    EditorContent
  },

  setup () {
    const { currentNoteContent } = useNotes()!
    const route = useRoute()

    const editor = useEditor({
      extensions: [
        StarterKit,
        Highlight
      ],
      editorProps: {
        attributes: {
          class:
            'max-w-none mx-10 prose prose-sm lg:prose-m xl:prose-lg focus:outline-none'
        }
      },
      content: 'loading...'
    })

    const getCurrentNoteContent = () => {
      const content = currentNoteContent(String(route.params.note))
      editor.value?.commands.setContent(content)
    }

    // set first file content on initial load
    window.ipc.on('requested-files', getCurrentNoteContent)

    // set new file content on note change
    watch(() => route.params.note, getCurrentNoteContent)

    window.ipc.on('save', () => {
      window.ipc.send('save', editor.value?.getHTML())
    })

    return { editor }
  }
})
</script>
