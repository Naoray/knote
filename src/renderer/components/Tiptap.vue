<template>
  <EditorContent :editor="editor" />
</template>

<script lang="ts">
import { defineComponent, watch } from 'vue'

import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import { useNotes } from '../hooks/notes'
import { useRoute } from 'vue-router'

export default defineComponent({
  components: {
    EditorContent
  },

  setup () {
    const { currentNote } = useNotes()!
    const route = useRoute()

    const editor = useEditor({
      extensions: [
        StarterKit
      ],
      editorProps: {
        attributes: {
          class:
            'max-w-none mx-10 prose prose-sm lg:prose-lg xl:prose-2xl focus:outline-none'
        }
      },
      onUpdate: ({ editor }) => console.log(editor.getHTML()),
      content: currentNote(String(route.params.note))?.content
    })

    // set first file content on initial load
    window.ipc.on('requested-files', () => {
      const note = currentNote(String(route.params.note))
      editor.value?.commands.setContent(note.content)
    })

    // set new file content on note change
    watch(
      () => route.params.note,
      noteId => {
        const note = currentNote(String(noteId))

        editor.value?.commands.setContent(note.content)
      }, { immediate: true })

    return { editor }
  }
})
</script>
