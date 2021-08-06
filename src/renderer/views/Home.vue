<template>
  <div class="flex max-h-screen space-x-4">
    <FileList class="w-1/3 overflow-y-auto border-r" />
    <Tiptap class="flex-1 py-8 overflow-y-auto" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

import FileList from '@components/FileList.vue'
import Tiptap from '@components/Tiptap.vue'

export default defineComponent({
  name: 'Home',
  components: {
    FileList,
    Tiptap
  }
})
</script>
