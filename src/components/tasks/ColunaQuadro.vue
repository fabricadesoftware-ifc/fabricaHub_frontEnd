<script setup lang="ts">
import { computed } from 'vue'
import { corStatusTarefa } from '@/utils/cores'
import type { StatusTarefa } from '@/utils/tipos'

const props = defineProps<{ titulo: string; status: StatusTarefa; quantidade: number }>()

const id = computed(() => `coluna-${props.status.replace(/\s/g, '-').toLowerCase()}`)
</script>

<template>
  <section class="coluna" :aria-labelledby="id" :style="{ '--cor': corStatusTarefa[status] }">
    <header class="cabecalho">
      <h2 :id="id" class="etiqueta">{{ titulo }}</h2>
      <span class="quantidade" :aria-label="`${quantidade} tarefas`">{{ String(quantidade).padStart(2, '0') }}</span>
    </header>
    <div class="cartoes">
      <slot />
      <p v-if="!quantidade" class="vazia">Nada por aqui.</p>
    </div>
  </section>
</template>

<style scoped>
.coluna {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
  padding: 12px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-menu);
  box-shadow: var(--shadow-hard);
}

.cabecalho {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.etiqueta {
  padding: 3px 8px;
  border: 1.5px solid var(--cor);
  border-radius: 4px;
  background: #111215;
  font-family: var(--font-mono);
  font-size: 10.5px;
  font-weight: 700;
  letter-spacing: .14em;
  color: var(--cor);
  white-space: nowrap;
}

.quantidade {
  padding: 1px 7px;
  border: 1px solid var(--border);
  border-radius: 4px;
  background: var(--tile);
  font-family: var(--font-mono);
  font-size: 13px;
  font-weight: 700;
}

.cartoes {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.vazia {
  margin-top: 12px;
  padding: 14px 10px;
  border: 1px dashed rgba(255, 255, 255, .12);
  border-radius: var(--radius-btn);
  font-size: 12.5px;
  text-align: center;
  color: var(--text-subtle);
}
</style>
