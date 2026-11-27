<script setup lang="ts">
import BotaoBase from '@/components/global/BotaoBase.vue'
import Carimbo from '@/components/global/Carimbo.vue'
import IconeSvg from '@/components/global/IconeSvg.vue'
import { dataCurta } from '@/utils/datas'
import type { StatusTarefa, Tarefa } from '@/utils/tipos'

withDefaults(
  defineProps<{
    tarefa: Tarefa
    destinos: StatusTarefa[]
    movendo?: boolean
    /** `cartao` (quadro) ou `cabecalho` (ficha da tarefa). */
    layout?: 'cartao' | 'cabecalho'
  }>(),
  { movendo: false, layout: 'cartao' },
)

defineEmits<{ mover: [status: StatusTarefa] }>()
</script>

<template>
  <div class="acoes" :class="layout">
    <template v-if="tarefa.status === 'A fazer' && destinos.includes('Fazendo')">
      <BotaoBase :bloco="layout === 'cartao'" :disabled="movendo" @click="$emit('mover', 'Fazendo')">
        Começar →
      </BotaoBase>
    </template>

    <template v-else-if="tarefa.status === 'Fazendo'">
      <template v-if="destinos.includes('A fazer')">
        <BotaoBase
          v-if="layout === 'cartao'"
          variante="secundario"
          class="voltar"
          aria-label="Voltar para A fazer"
          :disabled="movendo"
          @click="$emit('mover', 'A fazer')"
        >
          <IconeSvg nome="voltar" :tamanho="16" />
        </BotaoBase>
        <BotaoBase v-else variante="secundario" :disabled="movendo" @click="$emit('mover', 'A fazer')">
          ← Voltar para A fazer
        </BotaoBase>
      </template>
      <BotaoBase
        v-if="destinos.includes('Em revisão')"
        :bloco="layout === 'cartao'"
        :disabled="movendo"
        @click="$emit('mover', 'Em revisão')"
      >
        Enviar para revisão
      </BotaoBase>
    </template>

    <p v-else-if="tarefa.status === 'Em revisão'" class="aguardando">
      <IconeSvg nome="relogio" :tamanho="14" />
      Aguardando o líder
    </p>

    <div v-else-if="tarefa.status === 'Concluída'" class="carimbo" aria-hidden="true">
      <Carimbo
        :texto="tarefa.aprovadaEm ? `Aprovada · ${dataCurta(tarefa.aprovadaEm)}` : 'Aprovada'"
        tipo="aprovado"
        tamanho="pequeno"
      />
    </div>
    <p v-if="tarefa.status === 'Concluída'" class="sr-only">
      Aprovada{{ tarefa.aprovadaEm ? ` em ${dataCurta(tarefa.aprovadaEm)}` : '' }}
    </p>
  </div>
</template>

<style scoped>
.acoes {
  display: flex;
  align-items: center;
  gap: 8px;
}

.cabecalho {
  flex-wrap: wrap;
}

/* No cartão do quadro a coluna é estreita: botão mais compacto; se faltar espaço, quebra dentro do botão */
.cartao :deep(.botao) {
  min-width: 0;
  padding: 4px 10px;
  font-size: 13px;
  line-height: 1.2;
  text-align: center;
}

.voltar {
  flex-shrink: 0;
  width: 44px;
  padding: 0;
}

.aguardando {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  min-height: 36px;
  font-size: 12.5px;
  font-weight: 600;
  color: var(--status-revisao);
}

.carimbo {
  padding: 6px 0 2px 4px;
}
</style>
