<script setup lang="ts">
withDefaults(
  defineProps<{
    largura?: string
    altura?: string
    raio?: string
  }>(),
  { largura: '100%', altura: '12px', raio: '6px' },
)
</script>

<template>
  <span class="esqueleto" aria-hidden="true" :style="{ width: largura, height: altura, borderRadius: raio }" />
</template>

<style scoped>
/* Bloco de carregamento: pulsa por opacidade (sem gradiente). */
.esqueleto {
  display: block;
  flex-shrink: 0;
  background: var(--surface-2);
  animation: pulsar 1.4s ease-in-out infinite;
}

@keyframes pulsar {
  50% {
    opacity: .45;
  }
}

@media (prefers-reduced-motion: reduce) {
  .esqueleto {
    animation: none;
  }
}
</style>
