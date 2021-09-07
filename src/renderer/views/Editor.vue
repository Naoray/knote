<template>
  <Splitpanes class="flex max-h-screen min-h-screen overflow-y-hidden">
    <Pane v-if="showSidebar" size="33" class="flex min-h-screen">
      <FileList class="flex-1 w-full"/>
    </Pane>
    <Pane size="70" class="flex min-h-screen py-8">
      <MarkdownEditor class="flex-1 w-full mx-10"/>
    </Pane>
  </Splitpanes>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue'

import FileList from '@components/FileList.vue'
import MarkdownEditor from '@components/MarkdownEditor.vue'
import { Splitpanes, Pane } from 'splitpanes'

import 'splitpanes/dist/splitpanes.css'
import { useBroadcasts } from '../hooks/broadcasts'

export default defineComponent({
  name: 'Editor',
  components: {
    FileList,
    MarkdownEditor,
    Splitpanes,
    Pane,
  },
  setup () {
    const { appearance } = useBroadcasts()!

    const showSidebar = ref(true)

    watch(appearance, values => {
      showSidebar.value = values.showSidebar
    })

    return {
      showSidebar,
    }
  },
})
</script>

<style lang="postcss">
.splitpanes__pane {
  @apply overflow-y-auto h-auto
}
.splitpanes__splitter {
  @apply border-2
}
</style>
