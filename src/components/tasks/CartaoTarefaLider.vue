<script setup lang="ts">
import { computed } from 'vue'
import AvatarPessoa from '@/components/global/AvatarPessoa.vue'
import IconeSvg from '@/components/global/IconeSvg.vue'
import PilulaStatus from '@/components/global/PilulaStatus.vue'
import { diaMes, diasAte } from '@/utils/datas'
import type { StatusTarefa, Tarefa, Usuario } from '@/utils/tipos'

const ORDEM: StatusTarefa[] = ['A fazer', 'Fazendo', 'Em revisão', 'Concluída']

/**
 * Cartão do quadro de produção (líder): número, prioridade, responsável e prazo.
 * As setas movem para a coluna anterior/seguinte; "Em revisão" ganha o atalho para revisar.
 */
const props = withDefaults(
  defineProps<{ tarefa: Tarefa; responsavel?: Usuario; destinos: StatusTarefa[]; movendo?: boolean }>(),
  { responsavel: undefined, movendo: false },
)
defineEmits<{ mover: [status: StatusTarefa] }>()

const indice = computed(() => ORDEM.indexOf(props.tarefa.status))
const anterior = computed(() => ORDEM[indice.value - 1])
const seguinte = computed(() => ORDEM[indice.value + 1])
const atrasada = computed(() => props.tarefa.status !== 'Concluída' && !!props.tarefa.prazo && diasAte(props.tarefa.prazo) < 0)

const prazo = computed(() => {
  const t = props.tarefa
  if (t.status === 'Concluída') return t.aprovadaEm ? `ENTREGUE ${diaMes(t.aprovadaEm)}` : 'ENTREGUE'
  return t.prazo ? `ATÉ ${diaMes(t.prazo)}` : 'SEM PRAZO'
})
</script>

<template>
  <article class="cartao-tarefa-lider">
    <p class="topo">
      <span class="numero">#{{ tarefa.id }}</span>
      <PilulaStatus :status="tarefa.prioridade" />
    </p>
    <h3 class="titulo">
      <RouterLink :to="{ name: 'tarefa', params: { id: tarefa.id } }">{{ tarefa.titulo }}</RouterLink>
    </h3>
    <p class="branch">{{ tarefa.branch }}</p>
    <p class="meta">
      <span class="pessoa">
        <AvatarPessoa
          :nome="responsavel?.nome ?? '?'"
          :iniciais="responsavel?.iniciais"
          :cor="responsavel?.cor"
          :foto="responsavel?.foto"
          :tamanho="24"
          forma="circulo"
        />
        {{ responsavel?.nome ?? 'Sem responsável' }}
      </span>
      <span class="prazo" :class="{ atrasada }">{{ prazo }}<span v-if="atrasada" class="sr-only"> (atrasada)</span></span>
    </p>

    <RouterLink v-if="tarefa.status === 'Em revisão'" :to="{ name: 'revisoes', query: { tarefa: tarefa.id } }" class="revisar">
      Revisar entrega →
    </RouterLink>

    <div class="setas">
      <button
        type="button"
        class="seta"
        :disabled="!anterior || !destinos.includes(anterior) || movendo"
        :aria-label="anterior ? `Mover para ${anterior}` : 'Já está na primeira coluna'"
        @click="anterior && $emit('mover', anterior)"
      >
        <IconeSvg nome="voltar" :tamanho="14" />
      </button>
      <button
        type="button"
        class="seta"
        :disabled="!seguinte || !destinos.includes(seguinte) || movendo"
        :aria-label="seguinte ? `Mover para ${seguinte}` : 'Já está na última coluna'"
        @click="seguinte && $emit('mover', seguinte)"
      >
        <IconeSvg nome="voltar" :tamanho="14" class="direita" />
      </button>
    </div>
  </article>
</template>

<style scoped>
.cartao-tarefa-lider {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 12px;
  background: var(--surface-2);
  border: 1px solid var(--border);
  border-radius: var(--radius-btn);
  box-shadow: var(--shadow-hard);
}

.topo {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.numero {
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--text-subtle);
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
  margin-top: -4px;
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--text-subtle);
  overflow-wrap: anywhere;
}

.meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-top: 4px;
}

.pessoa {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
  font-size: 12.5px;
  font-weight: 600;
}

.pessoa :deep(.circulo) {
  border-color: transparent;
}

.prazo {
  flex-shrink: 0;
  font-family: var(--font-mono);
  font-size: 10.5px;
  font-weight: 700;
  letter-spacing: .06em;
  color: var(--text-subtle);
}

.prazo.atrasada {
  color: #FF6B5E;
}

.revisar {
  display: grid;
  place-items: center;
  min-height: 36px;
  border: 1px solid rgba(255, 133, 51, .45);
  border-radius: var(--radius-btn);
  background: rgba(255, 102, 0, .1);
  font-size: 12.5px;
  font-weight: 600;
  color: var(--accent);
  text-decoration: none;
  transition: background-color var(--dur-media);
}

.revisar:hover {
  background: rgba(255, 102, 0, .18);
}

.setas {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}

.seta {
  display: grid;
  place-items: center;
  min-height: 32px;
  border: 1px solid rgba(255, 255, 255, .12);
  border-radius: var(--radius-btn);
  background: transparent;
  color: var(--text-muted);
  cursor: pointer;
  transition: border-color var(--dur-media), color var(--dur-media);
}

.seta:not(:disabled):hover {
  border-color: rgba(255, 255, 255, .24);
  color: var(--text);
}

.seta:disabled {
  opacity: .35;
  cursor: default;
}

.direita {
  transform: scaleX(-1);
}
</style>
