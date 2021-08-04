<template>
  <tiptap />
</template>

<script lang="ts">
import { defineComponent } from 'vue'

import Tiptap from '@components/Tiptap.vue'

export default defineComponent({
  name: 'Home',
  components: {
    Tiptap
  }
})
</script>
