<script setup lang="ts">
withDefaults(defineProps<{ rotulo: string; titulo: string; nivel?: 'h1' | 'h2' }>(), { nivel: 'h2' })
</script>

<template>
  <div class="rotulo-secao">
    <span class="rotulo">{{ rotulo }}</span>
    <component :is="nivel" class="titulo">{{ titulo }}</component>
  </div>
</template>

<style scoped>
.rotulo-secao {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.rotulo {
  font-family: var(--font-mono);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: .14em;
  text-transform: uppercase;
  color: var(--accent);
}

.titulo {
  font-size: 18px;
  font-weight: 600;
  line-height: 1.3;
}
</style>
