<script setup lang="ts">
import { computed } from 'vue'
import { corStatusTarefa } from '@/utils/cores'
import type { StatusTarefa } from '@/utils/tipos'

const props = defineProps<{
  status: StatusTarefa
  /** Para onde pode mover. Vazio = travado (ex.: em revisão). */
  destinos: StatusTarefa[]
  rotulo: string
  desabilitado?: boolean
}>()

const emit = defineEmits<{ mudar: [status: StatusTarefa] }>()

const opcoes = computed(() => [props.status, ...props.destinos])

function aoMudar(evento: Event) {
  const valor = (evento.target as HTMLSelectElement).value as StatusTarefa
  if (valor !== props.status) emit('mudar', valor)
}
</script>

<template>
  <label class="seletor" :style="{ '--cor': corStatusTarefa[status] }">
    <span class="sr-only">{{ rotulo }}</span>
    <select :value="status" :disabled="desabilitado || !destinos.length" @change="aoMudar">
      <option v-for="opcao in opcoes" :key="opcao" :value="opcao">{{ opcao }}</option>
    </select>
  </label>
</template>

<style scoped>
.seletor {
  position: relative;
  display: inline-flex;
  justify-self: start;
  width: max-content;
}

select {
  appearance: none;
  min-width: 112px;
  min-height: 36px;
  padding: 0 28px 0 10px;
  border: 1px solid var(--cor);
  border-radius: var(--radius-btn);
  background: var(--tile);
  color: var(--cor);
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
}

select:disabled {
  cursor: default;
  opacity: .85;
}

/* Setinha desenhada com borda (sem imagem) */
.seletor::after {
  content: '';
  position: absolute;
  top: 50%;
  right: 11px;
  width: 6px;
  height: 6px;
  border-right: 1.5px solid var(--cor);
  border-bottom: 1.5px solid var(--cor);
  transform: translateY(-70%) rotate(45deg);
  pointer-events: none;
}

option {
  background: var(--surface);
  color: var(--text);
}

select {
  transition: border-color var(--dur-media), color var(--dur-media);
}

.seletor::after {
  transition: border-color var(--dur-media);
}
</style>
