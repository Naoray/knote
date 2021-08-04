<template>
  <editor-content :editor="editor" />
</template>

<script lang="ts">
import { defineComponent } from 'vue'

import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'

export default defineComponent({
  components: {
    EditorContent
  },

  setup () {
    const editor = useEditor({
      content: '<p>I’m running tiptap with Vue.js. 🎉</p>',
      extensions: [
        StarterKit
      ]
    })

    return { editor }
  }
})
</script>
