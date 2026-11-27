<script setup lang="ts">
import { corTextoSobre } from '@/utils/cores'

defineProps<{ id: number; nome: string; cor: string; aba: string; progresso?: number }>()
</script>

<template>
  <RouterLink
    :to="{ name: 'projeto', params: { id } }"
    class="pasta"
    :style="{ '--cor': cor, '--cor-texto-aba': corTextoSobre(cor) }"
  >
    <span class="aba">{{ aba }}</span>
    <span class="nome">{{ nome }}</span>
    <span v-if="progresso !== undefined" class="progresso">
      <span class="barra" aria-hidden="true"><span class="preenchido" :style="{ width: `${progresso}%` }" /></span>
      <span class="porcentagem">{{ progresso }}%<span class="sr-only"> concluído</span></span>
    </span>
  </RouterLink>
</template>

<style scoped>
.pasta {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 15px; /* espaço para a aba */
  min-height: 44px;
  padding: 10px 12px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 0 8px 8px 8px;
  box-shadow: var(--shadow-hard);
  color: var(--text);
  text-decoration: none;
}

.pasta:hover {
  border-color: rgba(255, 255, 255, .12);
}

.aba {
  position: absolute;
  left: -1px;
  bottom: 100%;
  height: 15px;
  padding: 0 7px;
  border-radius: 4px 4px 0 0;
  background: var(--cor);
  color: var(--cor-texto-aba);
  font-family: var(--font-mono);
  font-size: 9.5px;
  font-weight: 700;
  letter-spacing: .06em;
  line-height: 15px;
  white-space: nowrap;
}

.nome {
  font-size: 13.5px;
  font-weight: 600;
  line-height: 1.3;
}

.progresso {
  display: flex;
  align-items: center;
  gap: 8px;
}

.barra {
  flex: 1;
  height: 3px;
  border-radius: 2px;
  background: var(--surface-2);
  overflow: hidden;
}

.preenchido {
  display: block;
  height: 100%;
  background: var(--cor);
}

.porcentagem {
  font-family: var(--font-mono);
  font-size: 10px;
  color: var(--text-subtle);
}

/* Hover: sobe um pouco e a sombra dura cresce */
.pasta {
  transition: transform var(--dur-media) var(--ease-saida), box-shadow var(--dur-media) var(--ease-saida),
    border-color var(--dur-media);
}

.pasta:hover {
  transform: translateY(-2px);
  box-shadow: var(--sombra-elevada);
}

/* Barra de progresso enche ao aparecer */
.preenchido {
  transform-origin: left;
  animation: encher 700ms var(--ease-saida) backwards;
  animation-delay: 150ms;
}

@keyframes encher {
  from {
    transform: scaleX(0);
  }
}
</style>
