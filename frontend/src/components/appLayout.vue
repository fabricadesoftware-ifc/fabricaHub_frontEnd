<script setup lang="ts">
import { ref } from 'vue';

const status = ref('close')
const statusClass: Record<string, string> = {
  'open': 'w-67',
  'close': 'w-30'
}

const change = () => {
  if (status.value === 'open') {
    status.value = 'close'
  } else {
    status.value = 'open'
  }
}

</script>

<template>
  <div class="flex h-screen">

    <aside :class="[
      'bg-gray-800 flex justify-center items-center transition-all duration-200',
      statusClass[status]
    ]">
      Aside...
      <button @click="change" class="bg-red-500 cursor-pointer">Trocar</button>
    </aside>

    <div class="flex flex-col flex-1">

      <header class="h-16 border-b shrink-0 flex justify-center items-center">
        navbar...
      </header>

      <main class="flex-1 p-6 flex justify-center items-center">
        Main...
      </main>

    </div>
  </div>
</template>