<script setup lang="ts">
withDefaults(
  defineProps<{
    label: string
    /** String simples = valor e rótulo iguais. */
    opcoes: (string | { valor: string; rotulo: string })[]
    /** Primeira opção com valor vazio (ex.: "Todos"). */
    vazio?: string
    /** `lado`: label à esquerda (filtros); `cima`: label acima (formulários). */
    disposicao?: 'lado' | 'cima'
  }>(),
  { vazio: '', disposicao: 'lado' },
)

const modelo = defineModel<string>({ default: '' })

function valor(opcao: string | { valor: string }) {
  return typeof opcao === 'string' ? opcao : opcao.valor
}

function rotulo(opcao: string | { rotulo: string }) {
  return typeof opcao === 'string' ? opcao : opcao.rotulo
}
</script>

<template>
  <label class="campo-select" :class="disposicao">
    <span class="label">{{ label }}</span>
    <select v-model="modelo">
      <option v-if="vazio" value="">{{ vazio }}</option>
      <option v-for="opcao in opcoes" :key="valor(opcao)" :value="valor(opcao)">{{ rotulo(opcao) }}</option>
    </select>
  </label>
</template>

<style scoped>
.campo-select {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.cima {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 6px;
}

.label {
  font-size: 12px;
  color: var(--text-muted);
}

.cima .label {
  font-family: var(--font-mono);
  font-size: 10px;
  font-weight: 700;
  letter-spacing: .14em;
  text-transform: uppercase;
  color: var(--text-subtle);
}

select {
  min-height: 44px;
  padding: 0 12px;
  border: 1px solid var(--border);
  border-radius: var(--radius-btn);
  background: var(--surface);
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: border-color var(--dur-media);
}

.cima select {
  background: var(--ink);
}

select:hover {
  border-color: rgba(255, 255, 255, .2);
}

select:focus-visible {
  border-color: var(--accent);
}
</style>
