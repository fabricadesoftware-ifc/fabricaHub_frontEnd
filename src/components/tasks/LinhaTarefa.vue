<script setup lang="ts">
import { computed } from 'vue'
import PilulaStatus from '@/components/global/PilulaStatus.vue'
import SeletorStatusTarefa from '@/components/tasks/SeletorStatusTarefa.vue'
import type { StatusTarefa, Tarefa } from '@/utils/tipos'

const props = withDefaults(
  defineProps<{
    tarefa: Tarefa
    nomeProjeto: string
    destinos: StatusTarefa[]
    movendo?: boolean
  }>(),
  { movendo: false },
)

const emit = defineEmits<{ mover: [status: StatusTarefa] }>()

const pronta = computed(() => props.tarefa.status === 'Em revisão' || props.tarefa.status === 'Concluída')
const podeMarcar = computed(() => props.destinos.includes('Em revisão'))

/** Marcar a caixa = "terminei", envia para revisão. */
function aoMarcar(evento: Event) {
  // Volta a caixa ao estado real; ela fica marcada quando a tarefa chegar em revisão.
  ;(evento.target as HTMLInputElement).checked = pronta.value
  if (podeMarcar.value) emit('mover', 'Em revisão')
}
</script>

<template>
  <li class="linha" :class="{ pronta }">
    <label class="caixa">
      <input type="checkbox" :checked="pronta" :disabled="pronta || !podeMarcar || movendo" @change="aoMarcar" />
      <span class="sr-only">Enviar "{{ tarefa.titulo }}" para revisão</span>
    </label>
    <div class="textos">
      <RouterLink :to="{ name: 'tarefa', params: { id: tarefa.id } }" class="titulo">{{ tarefa.titulo }}</RouterLink>
      <p class="sub">{{ nomeProjeto }} · {{ tarefa.branch }}</p>
    </div>
    <SeletorStatusTarefa
      :status="tarefa.status"
      :destinos="destinos"
      :rotulo="`Status de ${tarefa.titulo}`"
      :desabilitado="movendo"
      @mudar="$emit('mover', $event)"
    />
    <PilulaStatus :status="tarefa.prioridade" class="prioridade" />
  </li>
</template>

<style scoped>
.linha {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto 64px;
  align-items: center;
  gap: 12px;
  padding: 12px 4px;
  border-bottom: 1px solid var(--border);
}

.linha:last-child {
  border-bottom: 0;
}

.caixa {
  display: grid;
  place-items: center;
  width: 32px;
  height: 32px;
  cursor: pointer;
}

input {
  width: 16px;
  height: 16px;
  margin: 0;
  accent-color: var(--brand-orange);
  cursor: pointer;
}

input:disabled {
  cursor: default;
}

.textos {
  min-width: 0;
}

.titulo {
  font-size: 14px;
  font-weight: 600;
  color: var(--text);
  text-decoration: none;
}

.titulo:hover {
  text-decoration: underline;
}

.pronta .titulo {
  color: var(--text-muted);
}

.sub {
  overflow: hidden;
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--text-subtle);
  text-overflow: ellipsis;
  white-space: nowrap;
}

.prioridade {
  justify-self: end;
}

@media (max-width: 599px) {
  .linha {
    grid-template-columns: auto minmax(0, 1fr);
    row-gap: 8px;
  }

  .linha > :nth-child(3) {
    grid-column: 2;
  }

  .prioridade {
    grid-column: 2;
    justify-self: start;
  }
}

.linha {
  transition: background-color var(--dur-media);
}

.linha:hover {
  background: rgba(255, 255, 255, .02);
}

.titulo {
  transition: color var(--dur-media);
}
</style>
