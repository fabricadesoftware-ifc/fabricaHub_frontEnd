<script setup lang="ts">
import { dataCurta, prazoRelativo } from '@/utils/datas'

/** Ficha da sidebar com o prazo mais próximo das tarefas abertas. */
defineProps<{ idTarefa: number; titulo: string; projeto: string; prazo: string }>()
</script>

<template>
  <RouterLink :to="{ name: 'tarefa', params: { id: idTarefa } }" class="proxima-entrega">
    <span class="rotulo">PRÓXIMA ENTREGA</span>
    <span class="quando">
      <span class="data">{{ dataCurta(prazo) }}</span>
      <span class="relativo">{{ prazoRelativo(prazo) }}</span>
    </span>
    <span class="tarefa">{{ titulo }} · <strong>{{ projeto }}</strong></span>
  </RouterLink>
</template>

<style scoped>
.proxima-entrega {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 2px;
  margin-top: 12px;
  padding: 12px 14px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 0 var(--radius-btn) var(--radius-btn) var(--radius-btn);
  box-shadow: var(--shadow-hard);
  color: var(--text);
  text-decoration: none;
}

.proxima-entrega::before {
  content: '';
  position: absolute;
  left: -1px;
  bottom: 100%;
  width: 56px;
  height: 10px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-bottom: 0;
  border-radius: 6px 6px 0 0;
}

.proxima-entrega:hover {
  border-color: rgba(255, 255, 255, .14);
}

.rotulo {
  font-family: var(--font-mono);
  font-size: 9.5px;
  font-weight: 700;
  letter-spacing: .14em;
  color: var(--accent);
}

.quando {
  display: flex;
  align-items: baseline;
  gap: 8px;
}

.data {
  font-family: var(--font-mono);
  font-size: 24px;
  font-weight: 800;
}

.relativo {
  font-size: 12px;
  color: var(--text-muted);
}

.tarefa {
  margin-top: 6px;
  padding-top: 8px;
  border-top: 1px solid var(--border);
  font-size: 12px;
  color: var(--text-muted);
}

.tarefa strong {
  color: var(--text);
}

/* Hover: sobe um pouco e a sombra dura cresce */
.proxima-entrega {
  transition: transform var(--dur-media) var(--ease-saida), box-shadow var(--dur-media) var(--ease-saida),
    border-color var(--dur-media);
}

.proxima-entrega:hover {
  transform: translateY(-2px);
  box-shadow: var(--sombra-elevada);
}
</style>
