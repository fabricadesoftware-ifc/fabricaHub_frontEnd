<script setup lang="ts">
import { ref } from 'vue'
import { dataMinuscula } from '@/utils/datas'
import type { Projeto, Tarefa } from '@/utils/tipos'

const props = withDefaults(
  defineProps<{ tarefa: Tarefa; projeto?: Projeto | null; nomeCriador?: string }>(),
  { projeto: null, nomeCriador: '' },
)

const copiado = ref(false)

async function copiarBranch() {
  try {
    await navigator.clipboard.writeText(props.tarefa.branch)
    copiado.value = true
    setTimeout(() => (copiado.value = false), 1600)
  } catch {
    copiado.value = false
  }
}
</script>

<template>
  <dl class="dados">
    <div class="linha">
      <dt>Projeto</dt>
      <dd class="projeto">
        <span v-if="projeto" class="ponto" :style="{ background: projeto.cor }" aria-hidden="true" />
        {{ projeto?.nome ?? '—' }}
      </dd>
    </div>
    <div class="linha">
      <dt>Prioridade</dt>
      <dd class="prioridade" :class="tarefa.prioridade.toLowerCase()">{{ tarefa.prioridade }}</dd>
    </div>
    <div class="linha">
      <dt>Branch</dt>
      <dd class="branch">
        <code>{{ tarefa.branch }}</code>
        <button type="button" class="copiar" @click="copiarBranch">{{ copiado ? 'Copiado' : 'Copiar' }}</button>
        <span class="sr-only" role="status">{{ copiado ? 'Branch copiada' : '' }}</span>
      </dd>
    </div>
    <div class="linha">
      <dt>Função</dt>
      <dd>{{ tarefa.funcao }}</dd>
    </div>
    <div class="linha">
      <dt>Tipo</dt>
      <dd>{{ tarefa.tipo }}</dd>
    </div>
    <div class="linha">
      <dt>Tamanho</dt>
      <dd>{{ tarefa.tamanho }}</dd>
    </div>
    <div class="linha">
      <dt>Previsão</dt>
      <dd>{{ tarefa.previsaoHoras }} h</dd>
    </div>
    <div class="linha">
      <dt>Criada por</dt>
      <dd>{{ nomeCriador || '—' }} · {{ dataMinuscula(tarefa.criadaEm) }}</dd>
    </div>
  </dl>
</template>

<style scoped>
.dados {
  display: flex;
  flex-direction: column;
  margin: 0;
}

.linha {
  display: grid;
  grid-template-columns: 96px minmax(0, 1fr);
  align-items: center;
  gap: 12px;
  min-height: 40px;
  padding: 6px 0;
  border-bottom: 1px solid var(--border);
}

.linha:last-child {
  border-bottom: 0;
}

dt {
  font-family: var(--font-mono);
  font-size: 10px;
  font-weight: 700;
  letter-spacing: .12em;
  text-transform: uppercase;
  color: var(--text-subtle);
}

dd {
  margin: 0;
  font-size: 13px;
  font-weight: 600;
}

.projeto {
  display: flex;
  align-items: center;
  gap: 8px;
}

.ponto {
  width: 8px;
  height: 8px;
  border-radius: 2px;
}

.prioridade.alta { color: #FF6B5E; }
.prioridade.média { color: #F2B13A; }
.prioridade.baixa { color: #3FC6C6; }

.branch {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  min-width: 0;
}

code {
  overflow-wrap: anywhere;
  padding: 3px 8px;
  border: 1px solid var(--border);
  border-radius: 4px;
  background: var(--tile);
  font-family: var(--font-mono);
  font-size: 11.5px;
  font-weight: 500;
}

.copiar {
  flex-shrink: 0;
  min-height: 32px;
  padding: 0 4px;
  border: 0;
  background: none;
  color: var(--accent);
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
}

.copiar:hover {
  text-decoration: underline;
}
</style>
