<template>
  <Splitpanes class="flex max-h-screen min-h-screen">
    <Pane size="30" class="flex min-h-screen overflow-y-auto ">
      <FileList class="flex-1 w-full"/>
    </Pane>
    <Pane size="70" class="flex min-h-screen py-8 overflow-y-auto">
      <MarkdownEditor class="flex-1 w-full mx-10"/>
    </Pane>
  </Splitpanes>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

import FileList from '@components/FileList.vue'
import MarkdownEditor from '@components/MarkdownEditor.vue'
import { Splitpanes, Pane } from 'splitpanes'
import { useNotes } from '../hooks/notes'

import 'splitpanes/dist/splitpanes.css'

export default defineComponent({
  name: 'Editor',
  components: {
    FileList,
    MarkdownEditor,
    Splitpanes,
    Pane
  },
  setup () {
    const { requestNotes } = useNotes()!

    requestNotes()
  }
})
</script>

<style lang="postcss">
  .splitpanes__splitter {
    @apply border-2
  }
  </style>
