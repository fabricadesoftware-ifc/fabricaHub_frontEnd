<script setup lang="ts">
import { dataCurta } from '@/utils/datas'
import type { Noticia } from '@/utils/tipos'

defineProps<{ noticia: Noticia }>()
</script>

<template>
  <li class="noticia">
    <p class="data">{{ dataCurta(noticia.data) }}</p>
    <RouterLink :to="{ name: 'noticia', params: { id: noticia.id } }" class="titulo">{{ noticia.titulo }}</RouterLink>
  </li>
</template>

<style scoped>
.noticia {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 10px 0;
  border-bottom: 1px solid var(--border);
}

.noticia:last-child {
  border-bottom: 0;
}

.data {
  font-family: var(--font-mono);
  font-size: 10.5px;
  font-weight: 700;
  color: var(--accent);
}

.titulo {
  font-size: 13.5px;
  font-weight: 600;
  color: var(--text);
  text-decoration: none;
}

.titulo:hover {
  text-decoration: underline;
}
</style>
