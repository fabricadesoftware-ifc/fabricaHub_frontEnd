<script setup lang="ts">
import type { Projeto } from '@/utils/tipos'

defineProps<{ projetos: Projeto[] }>()

/** null = Todos */
const selecionado = defineModel<number | null>({ default: null })
</script>

<template>
  <div class="filtro" role="group" aria-label="Filtrar por projeto">
    <button type="button" class="chip" :class="{ ativo: selecionado === null }" :aria-pressed="selecionado === null" @click="selecionado = null">
      <span class="ponto todos" aria-hidden="true" />
      Todos
    </button>
    <button
      v-for="projeto in projetos"
      :key="projeto.id"
      type="button"
      class="chip"
      :class="{ ativo: selecionado === projeto.id }"
      :aria-pressed="selecionado === projeto.id"
      @click="selecionado = projeto.id"
    >
      <span class="ponto" :style="{ background: projeto.cor }" aria-hidden="true" />
      {{ projeto.nome }}
    </button>
  </div>
</template>

<style scoped>
.filtro {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.chip {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-height: 36px;
  padding: 0 14px;
  border: 1px solid rgba(255, 255, 255, .12);
  border-radius: var(--radius-pill);
  background: var(--surface);
  color: var(--text);
  font-size: 12.5px;
  font-weight: 600;
  cursor: pointer;
}

.chip:hover {
  border-color: rgba(255, 255, 255, .24);
}

.chip.ativo {
  background: var(--text);
  border-color: var(--text);
  color: var(--ink);
}

.ponto {
  width: 7px;
  height: 7px;
  border-radius: 2px;
}

.ponto.todos {
  background: var(--text-subtle);
}

/* No chip ativo (fundo claro) a bolinha precisa ser escura para aparecer */
.chip.ativo .ponto.todos {
  background: var(--ink);
}

.chip {
  transition: background-color var(--dur-media), color var(--dur-media), border-color var(--dur-media),
    transform var(--dur-rapida);
}

.chip:active {
  transform: scale(.96);
}
</style>
