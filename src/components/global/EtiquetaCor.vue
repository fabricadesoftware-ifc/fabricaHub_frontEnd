<script setup lang="ts">
import { corTextoSobre } from '@/utils/cores'

/** Aba colorida de pasta/ficha (ex.: "PAINEL", "P · 2 TAREFAS"). Posicione pelo pai. */
defineProps<{ texto: string; cor: string }>()
</script>

<template>
  <span class="etiqueta" :style="{ background: cor, color: corTextoSobre(cor) }">{{ texto }}</span>
</template>

<style scoped>
.etiqueta {
  display: inline-flex;
  align-items: center;
  height: 15px;
  padding: 0 7px;
  border-radius: 4px 4px 0 0;
  font-family: var(--font-mono);
  font-size: 9.5px;
  font-weight: 700;
  letter-spacing: .06em;
  text-transform: uppercase;
  white-space: nowrap;
}
</style>
