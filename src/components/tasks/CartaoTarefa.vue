<script setup lang="ts">
import EtiquetaCor from '@/components/global/EtiquetaCor.vue'
import PilulaStatus from '@/components/global/PilulaStatus.vue'
import AcoesTarefa from '@/components/tasks/AcoesTarefa.vue'
import { esforco } from '@/utils/tarefas'
import type { Projeto, StatusTarefa, Tarefa } from '@/utils/tipos'

withDefaults(
  defineProps<{
    tarefa: Tarefa
    projeto?: Projeto | null
    destinos: StatusTarefa[]
    movendo?: boolean
  }>(),
  { projeto: null, movendo: false },
)

defineEmits<{ mover: [status: StatusTarefa] }>()
</script>

<template>
  <article class="cartao-tarefa">
    <EtiquetaCor v-if="projeto" class="aba" :texto="projeto.nome.split(' ')[0]!" :cor="projeto.cor" />
    <h3 class="titulo">
      <RouterLink :to="{ name: 'tarefa', params: { id: tarefa.id } }">{{ tarefa.titulo }}</RouterLink>
    </h3>
    <p class="branch">{{ tarefa.branch }}</p>
    <p class="meta">
      <PilulaStatus :status="tarefa.prioridade" />
      <span class="esforco">{{ esforco(tarefa) }}</span>
    </p>
    <AcoesTarefa
      class="acoes"
      :tarefa="tarefa"
      :destinos="destinos"
      :movendo="movendo"
      @mover="$emit('mover', $event)"
    />
  </article>
</template>

<style scoped>
.cartao-tarefa {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-top: 15px; /* espaço para a aba */
  padding: 12px 14px 14px;
  background: var(--surface-2);
  border: 1px solid var(--border);
  border-radius: 0 var(--radius-btn) var(--radius-btn) var(--radius-btn);
  box-shadow: var(--shadow-hard);
}

.aba {
  position: absolute;
  left: -1px;
  bottom: 100%;
}

.titulo {
  font-size: 14px;
  font-weight: 600;
  line-height: 1.35;
}

.titulo a {
  color: var(--text);
  text-decoration: none;
}

.titulo a:hover {
  text-decoration: underline;
}

.branch {
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--text-subtle);
  overflow-wrap: anywhere;
}

.meta {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 2px;
}

.esforco {
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--text-muted);
}

.acoes {
  margin-top: 8px;
}

/* Hover: sobe um pouco e a sombra dura cresce */
.cartao-tarefa {
  transition: transform var(--dur-media) var(--ease-saida), box-shadow var(--dur-media) var(--ease-saida),
    border-color var(--dur-media);
}

.cartao-tarefa:hover {
  transform: translateY(-2px);
  box-shadow: var(--sombra-elevada);
}
</style>
