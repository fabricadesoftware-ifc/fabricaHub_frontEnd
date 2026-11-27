<script setup lang="ts" generic="T extends string">
import { useTemplateRef } from 'vue'

/**
 * Abas de pasta (role="tablist"). O conteúdo da aba ativa vai no slot padrão,
 * dentro do painel `${id}-painel`. Setas ← → trocam de aba.
 */
const props = defineProps<{ id: string; label: string; abas: { valor: T; rotulo: string; contador?: number }[] }>()

const ativa = defineModel<T>({ required: true })
const botoes = useTemplateRef<HTMLButtonElement[]>('botoes')

function aoTeclar(evento: KeyboardEvent, indice: number) {
  const passo = evento.key === 'ArrowRight' ? 1 : evento.key === 'ArrowLeft' ? -1 : 0
  if (!passo) return
  evento.preventDefault()
  const proximo = (indice + passo + props.abas.length) % props.abas.length
  ativa.value = props.abas[proximo]!.valor
  botoes.value?.[proximo]?.focus()
}
</script>

<template>
  <div class="abas-pasta">
    <div class="lista" role="tablist" :aria-label="label">
      <button
        v-for="(aba, i) in abas"
        :id="`${id}-aba-${aba.valor}`"
        ref="botoes"
        :key="aba.valor"
        type="button"
        role="tab"
        class="aba"
        :class="{ ativa: ativa === aba.valor }"
        :aria-selected="ativa === aba.valor"
        :aria-controls="`${id}-painel`"
        :tabindex="ativa === aba.valor ? 0 : -1"
        @click="ativa = aba.valor"
        @keydown="aoTeclar($event, i)"
      >
        {{ aba.rotulo }}
        <span v-if="aba.contador !== undefined" class="contador">{{ aba.contador }}</span>
      </button>
    </div>
    <div :id="`${id}-painel`" class="painel" role="tabpanel" :aria-labelledby="`${id}-aba-${ativa}`" tabindex="0">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.lista {
  display: flex;
  gap: 4px;
  overflow-x: auto;
  scrollbar-width: none;
}

.aba {
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-height: 44px;
  padding: 0 16px;
  border: 1px solid var(--border);
  border-bottom: 0;
  border-radius: var(--radius-btn) var(--radius-btn) 0 0;
  background: var(--sidebar);
  color: var(--text-muted);
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: color var(--dur-media), background-color var(--dur-media);
}

.aba:hover {
  color: var(--text);
}

.aba.ativa {
  background: var(--surface);
  color: var(--text);
  box-shadow: inset 0 2px 0 var(--accent);
}

.contador {
  padding: 1px 6px;
  border-radius: 4px;
  background: var(--surface-2);
  font-family: var(--font-mono);
  font-size: 10px;
  font-weight: 700;
  color: var(--text-muted);
}

.painel {
  min-height: 200px;
  padding: 20px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 0 var(--radius-menu) var(--radius-menu) var(--radius-menu);
  box-shadow: var(--shadow-hard);
}

.painel:focus {
  outline: none;
}

@media (max-width: 599px) {
  .painel {
    padding: 16px;
  }
}
</style>
