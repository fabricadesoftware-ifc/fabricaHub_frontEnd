<script setup lang="ts">
import AvatarPessoa from '@/components/global/AvatarPessoa.vue'
import type { ItemConversa } from '@/composables/useCaixaMensagens'
import { horaOuData } from '@/utils/datas'

/** Linha da lista de conversas (botão). `ativa` = conversa aberta ao lado. */
defineProps<{ item: ItemConversa; ativa: boolean; rotuloTipo: string }>()
defineEmits<{ abrir: [] }>()
</script>

<template>
  <button type="button" class="item-conversa" :class="{ ativa, nova: item.naoLidas }" :aria-current="ativa ? 'true' : undefined" @click="$emit('abrir')">
    <AvatarPessoa
      :nome="item.nome"
      :iniciais="item.avatar.iniciais"
      :cor="item.avatar.cor"
      :foto="item.avatar.foto"
      :forma="item.avatar.forma"
      :tamanho="36"
    />
    <span class="textos">
      <span class="topo">
        <span class="nome">{{ item.nome }}</span>
        <span v-if="item.ultima" class="hora">{{ horaOuData(item.ultima.em) }}</span>
      </span>
      <span class="tipo">{{ rotuloTipo }}</span>
      <span class="previa">{{ item.previa }}</span>
    </span>
    <span v-if="item.naoLidas" class="ponto"><span class="sr-only">{{ item.naoLidas }} não lidas</span></span>
  </button>
</template>

<style scoped>
.item-conversa {
  position: relative;
  display: flex;
  align-items: flex-start;
  gap: 12px;
  width: 100%;
  min-height: 72px;
  padding: 12px;
  border: 1px solid transparent;
  border-radius: var(--radius-btn);
  background: transparent;
  text-align: left;
  cursor: pointer;
  transition: background-color var(--dur-media), border-color var(--dur-media);
}

.item-conversa:hover {
  background: rgba(255, 255, 255, .03);
}

.ativa,
.ativa:hover {
  background: var(--surface-2);
  border-color: var(--border);
}

.item-conversa :deep(.circulo) {
  border-color: transparent;
}

.textos {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.topo {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 8px;
}

.nome {
  overflow: hidden;
  font-size: 13.5px;
  font-weight: 600;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.hora {
  flex-shrink: 0;
  font-family: var(--font-mono);
  font-size: 10.5px;
  color: var(--text-subtle);
}

.tipo {
  font-family: var(--font-mono);
  font-size: 9.5px;
  font-weight: 700;
  letter-spacing: .12em;
  text-transform: uppercase;
  color: var(--text-subtle);
}

.previa {
  overflow: hidden;
  font-size: 12px;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: var(--text-muted);
}

.nova .previa {
  color: var(--text);
}

.ponto {
  position: absolute;
  top: 34px;
  right: 12px;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--brand-orange);
}

.nova .textos {
  padding-right: 12px;
}
</style>
