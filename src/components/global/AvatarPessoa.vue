<script setup lang="ts">
import { computed } from 'vue'
import { corTextoSobre } from '@/utils/cores'

const props = withDefaults(
  defineProps<{
    nome: string
    cor?: string
    tamanho?: number
    /** `circulo` (pilhas de equipe) ou `quadrado` (mensagens, comentários). */
    forma?: 'quadrado' | 'circulo'
  }>(),
  { cor: '#2A2AFF', tamanho: 28, forma: 'quadrado' },
)

const iniciais = computed(() => props.nome.slice(0, 2).toUpperCase())
</script>

<template>
  <span
    class="avatar"
    :class="forma"
    aria-hidden="true"
    :style="{
      width: `${tamanho}px`,
      height: `${tamanho}px`,
      fontSize: `${Math.round(tamanho * 0.38)}px`,
      background: cor,
      color: corTextoSobre(cor),
    }"
  >
    {{ iniciais }}
  </span>
</template>

<style scoped>
.avatar {
  flex-shrink: 0;
  display: inline-grid;
  place-items: center;
  font-weight: 700;
  line-height: 1;
}

.quadrado {
  border-radius: 8px;
}

.circulo {
  border-radius: 50%;
  border: 2px solid var(--surface);
}
</style>
