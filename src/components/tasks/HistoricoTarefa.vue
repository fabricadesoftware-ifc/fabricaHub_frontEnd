<script setup lang="ts">
import { corStatusTarefa } from '@/utils/cores'
import { dataHora } from '@/utils/datas'
import type { HistoricoTarefa, Usuario } from '@/utils/tipos'

defineProps<{
  eventos: HistoricoTarefa[]
  usuario: (id: number) => Usuario | undefined
}>()
</script>

<template>
  <TransitionGroup tag="ol" name="lista" class="historico">
    <li v-for="evento in eventos" :key="`${evento.id}-${evento.em}`" class="evento" :style="{ '--cor': corStatusTarefa[evento.status] }">
      <span class="ponto" aria-hidden="true" />
      <div class="conteudo">
        <p class="topo">
          <span class="status">{{ evento.status }}</span>
          <span class="data">{{ dataHora(evento.em) }}</span>
        </p>
        <p class="acao">{{ usuario(evento.idAutor)?.nome ?? 'Alguém' }} {{ evento.acao }}</p>
      </div>
    </li>
  </TransitionGroup>
</template>

<style scoped>
.historico {
  display: flex;
  flex-direction: column;
  margin: 0;
  padding: 0;
  list-style: none;
}

.evento {
  position: relative;
  display: flex;
  gap: 12px;
  padding-bottom: 14px;
}

/* Linha vertical ligando os pontos */
.evento:not(:last-child)::before {
  content: '';
  position: absolute;
  top: 12px;
  bottom: 0;
  left: 4px;
  width: 1px;
  background: var(--border);
}

.ponto {
  flex-shrink: 0;
  width: 9px;
  height: 9px;
  margin-top: 5px;
  border-radius: 50%;
  background: var(--cor);
}

.topo {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  justify-content: space-between;
  gap: 4px 10px;
}

.status {
  font-size: 13px;
  font-weight: 700;
  color: var(--cor);
}

.data {
  font-family: var(--font-mono);
  font-size: 10.5px;
  color: var(--text-subtle);
}

.acao {
  font-family: var(--font-mono);
  font-size: 11.5px;
  color: var(--text-muted);
}
</style>
