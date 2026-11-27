<script setup lang="ts">
import type { RouteLocationRaw } from 'vue-router'

/** Caminho no topo das telas de detalhe ("Projetos / Painel de Integração"). O último item é a página atual. */
defineProps<{ itens: { texto: string; para?: RouteLocationRaw }[] }>()
</script>

<template>
  <nav class="trilha" aria-label="Caminho">
    <ol>
      <li v-for="(item, i) in itens" :key="i">
        <RouterLink v-if="item.para && i < itens.length - 1" :to="item.para">{{ item.texto }}</RouterLink>
        <span v-else aria-current="page">{{ item.texto }}</span>
      </li>
    </ol>
  </nav>
</template>

<style scoped>
ol {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  margin: 0;
  padding: 0;
  list-style: none;
  font-size: 12px;
  font-weight: 600;
}

li + li::before {
  content: '/';
  margin: 0 8px;
  color: var(--text-subtle);
}

a {
  display: inline-flex;
  align-items: center;
  min-height: 32px;
  color: var(--text-muted);
  text-decoration: none;
}

a:hover {
  color: var(--text);
  text-decoration: underline;
}

[aria-current='page'] {
  color: var(--text);
}
</style>
