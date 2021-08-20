<template>
  <div class="flex max-h-screen min-h-screen space-x-4">
    <FileList class="w-1/3 overflow-y-auto border-r xl:w-1/4" />
    <MarkdownEditor class="flex-1 py-8 overflow-y-auto" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

import FileList from '@components/FileList.vue'
import MarkdownEditor from '@components/MarkdownEditor.vue'
import { useNotes } from '../hooks/notes'

export default defineComponent({
  name: 'Editor',
  components: {
    FileList,
    MarkdownEditor
  },
  setup () {
    const { requestNotes } = useNotes()!

    requestNotes()
  }
})
</script>
