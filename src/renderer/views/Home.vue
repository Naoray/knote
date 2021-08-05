<template>
  <div class="flex space-x-4">
    <file-list class="w-1/3 min-h-screen border-r" />
    <tiptap />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

import FileList from '@components/FileList.vue'
import Tiptap from '@components/Tiptap.vue'

const messages = [
  {
    id: 1,
    subject: 'Velit placeat sit ducimus non sed',
    sender: 'Gloria Roberston',
    time: '1d ago',
    datetime: '2021-01-27T16:35',
    preview:
      'Doloremque dolorem maiores assumenda dolorem facilis. Velit vel in a rerum natus facere. Enim rerum eaque qui facilis. Numquam laudantium sed id dolores omnis in. Eos reiciendis deserunt maiores et accusamus quod dolor.'
  }
  // More messages...
]

export default defineComponent({
  name: 'Home',
  components: {
    FileList,
    Tiptap
  }
})
</script>
