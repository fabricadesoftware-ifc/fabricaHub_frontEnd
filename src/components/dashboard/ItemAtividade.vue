<script setup lang="ts">
import type { Atividade } from '@/utils/tipos'

defineProps<{ atividade: Atividade; nomeAutor: string }>()
</script>

<template>
  <li class="atividade">
    <p class="texto">
      <strong>{{ nomeAutor }}</strong> {{ atividade.acao }}
      <RouterLink v-if="atividade.idTarefa" :to="{ name: 'tarefa', params: { id: atividade.idTarefa } }" class="alvo">
        {{ atividade.alvo }}
      </RouterLink>
      <span v-else class="alvo">{{ atividade.alvo }}</span>
    </p>
    <p class="tempo">{{ atividade.haQuantoTempo }}</p>
  </li>
</template>

<style scoped>
.atividade {
  padding: 10px 0;
  border-bottom: 1px dashed rgba(255, 255, 255, .12);
  font-family: var(--font-mono);
}

.atividade:last-child {
  border-bottom: 0;
}

.texto {
  font-size: 12px;
  line-height: 1.5;
  color: var(--text-muted);
}

.texto strong {
  color: var(--text);
}

.alvo {
  color: var(--accent);
  text-decoration: none;
}

a.alvo:hover {
  text-decoration: underline;
}

.tempo {
  font-size: 10.5px;
  color: var(--text-subtle);
}
</style>
