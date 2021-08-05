<template>
  <ul class="divide-y divide-gray-200">
    <li v-for="message in messages" :key="message.id" class="relative px-4 py-5 bg-white hover:bg-gray-50 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600">
      <div class="flex justify-between space-x-3">
        <div class="flex-1 min-w-0">
          <a href="#" class="block focus:outline-none">
            <span class="absolute inset-0" aria-hidden="true" />
            <p class="text-sm font-medium text-gray-900 truncate">{{ message.title }}</p>
          </a>
        </div>
        <time :datetime="message.datetime" class="flex-shrink-0 text-sm text-gray-500 whitespace-nowrap">{{ message.time }}</time>
      </div>
      <div class="mt-1">
        <p class="text-sm text-gray-600 line-clamp-2">
          {{ message.preview }}
        </p>
      </div>
    </li>
  </ul>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

const messages = [
  {
    id: 1,
    title: 'Some notes',
    time: '1h ago',
    datetime: '2021-01-27T16:35',
    preview:
      'Podcast eres maiores assumenda dolorem facilis. Velit vel in a rerum natus facere. Enim rerum eaque qui facilis. Numquam laudantium sed id dolores omnis in. Eos reiciendis deserunt maiores et accusamus quod dolor.'
  },
  {
    id: 2,
    title: 'Velit placeat sit ducimus non sed',
    time: '1d ago',
    datetime: '2021-01-27T16:35',
    preview:
      'Doloremque dolorem maiores assumenda dolorem facilis. Velit vel in a rerum natus facere. Enim rerum eaque qui facilis. Numquam laudantium sed id dolores omnis in. Eos reiciendis deserunt maiores et accusamus quod dolor.'
  },
  {
    id: 3,
    title: 'Lore',
    time: '2d ago',
    datetime: '2021-01-27T16:35',
    preview:
      'Da dolorem maiores assumenda dolorem facilis. Velit vel in a rerum natus facere. Enim rerum eaque qui facilis. Numquam laudantium sed id dolores omnis in. Eos reiciendis deserunt maiores et accusamus quod dolor.'
  },
  {
    id: 4,
    title: 'OIther notes',
    time: '7d ago',
    datetime: '2021-01-27T16:35',
    preview:
      'Another maiores assumenda dolorem facilis. Velit vel in a rerum natus facere. Enim rerum eaque qui facilis. Numquam laudantium sed id dolores omnis in. Eos reiciendis deserunt maiores et accusamus quod dolor.'
  },
  {
    id: 5,
    title: 'Velit placeat sit ducimus non sed',
    time: '14d ago',
    datetime: '2021-01-27T16:35',
    preview:
      'Doloremque dolorem maiores assumenda dolorem facilis. Velit vel in a rerum natus facere. Enim rerum eaque qui facilis. Numquam laudantium sed id dolores omnis in. Eos reiciendis deserunt maiores et accusamus quod dolor.'
  },
  {
    id: 6,
    title: 'Lore',
    time: '15d ago',
    datetime: '2021-01-27T16:35',
    preview:
      'Da dolorem maiores assumenda dolorem facilis. Velit vel in a rerum natus facere. Enim rerum eaque qui facilis. Numquam laudantium sed id dolores omnis in. Eos reiciendis deserunt maiores et accusamus quod dolor.'
  },
  {
    id: 7,
    title: 'Ramen Noodles',
    time: '20d ago',
    datetime: '2021-01-27T16:35',
    preview:
      'Doloremque dolorem maiores assumenda dolorem facilis. Velit vel in a rerum natus facere. Enim rerum eaque qui facilis. Numquam laudantium sed id dolores omnis in. Eos reiciendis deserunt maiores et accusamus quod dolor.'
  },
  {
    id: 8,
    title: 'Test',
    time: '25d ago',
    datetime: '2021-01-27T16:35',
    preview:
      'Da dolorem maiores assumenda dolorem facilis. Velit vel in a rerum natus facere. Enim rerum eaque qui facilis. Numquam laudantium sed id dolores omnis in. Eos reiciendis deserunt maiores et accusamus quod dolor.'
  }
]

export default defineComponent({
  setup () {
    return {
      messages
    }
  }
})
</script>
