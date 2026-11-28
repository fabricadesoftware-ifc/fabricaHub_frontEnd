<script setup lang="ts">
import { defineAsyncComponent } from 'vue'

// Seletor de papel só existe em desenvolvimento (fica fora do bundle de produção).
const SeletorPapel = import.meta.env.DEV
  ? defineAsyncComponent(() => import('@/components/global/SeletorPapel.vue'))
  : null
</script>

<template>
  <RouterView />
  <component :is="SeletorPapel" v-if="SeletorPapel && $route.name === 'login'" />
</template>
