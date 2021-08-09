<template>
  <EditorContent :editor="editor" />
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, watch, watchEffect } from 'vue'

import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import { useNotes } from '../hooks/notes'
import { useRoute } from 'vue-router'

export default defineComponent({
  components: {
    EditorContent
  },

  setup () {
    const notes = useNotes()!
    const route = useRoute()

    const findNote = () => notes.data.find(item => item.key === route.params.note)

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
      content: findNote()?.content
    })

    watch(
      () => route.params.note,
      () => {
        if (!editor.value) return

        const note = findNote()
        if (!note) return

        editor.value.commands.setContent(note.content)
      }, { immediate: true })

    return { editor }
  }
})
</script>
