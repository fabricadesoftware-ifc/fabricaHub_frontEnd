<script setup lang="ts">
import { computed } from 'vue'
import type { Prioridade, StatusProjeto, StatusTarefa } from '@/utils/tipos'

const props = defineProps<{
  /** Status/prioridade conhecidos ganham cor automática; outro texto usa `cor`. */
  status: StatusProjeto | StatusTarefa | Prioridade | (string & {})
  /** Sobrescreve a cor (borda e texto). */
  cor?: string
}>()

const cores: Record<string, string> = {
  'Em andamento': '#3FB950',
  Planejamento: '#FF8533',
  Pausado: 'var(--text-muted)',
  Concluído: '#9AABFF',
  Alta: '#FF6B5E',
  Média: '#F2B13A',
  Baixa: '#3FC6C6',
  'A fazer': 'var(--status-afazer)',
  Fazendo: 'var(--status-fazendo)',
  'Em revisão': 'var(--status-revisao)',
  Concluída: 'var(--status-concluida)',
}

const corFinal = computed(() => props.cor ?? cores[props.status] ?? 'var(--text-muted)')
</script>

<template>
  <span class="pilula" :style="{ '--cor': corFinal }">{{ status }}</span>
</template>

<style scoped>
.pilula {
  display: inline-flex;
  align-items: center;
  padding: 3px 10px;
  border: 1.5px solid var(--cor);
  border-radius: var(--radius-pill);
  color: var(--cor);
  font-family: var(--font-mono);
  font-size: 10.5px;
  font-weight: 700;
  letter-spacing: .06em;
  text-transform: uppercase;
  line-height: 1.4;
  white-space: nowrap;
}
</style>
