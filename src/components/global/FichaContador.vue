<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{ numero: number; label: string; descricao?: string; destaque?: boolean }>(),
  { descricao: '', destaque: false },
)

// Contador mecânico: sempre pelo menos 2 dígitos ("06").
const digitos = computed(() => String(Math.max(0, Math.trunc(props.numero))).padStart(2, '0').split(''))
</script>

<template>
  <article class="ficha" :class="{ destaque }">
    <p class="label">{{ label }}</p>
    <p class="contador">
      <span class="sr-only">{{ numero }}</span>
      <span v-for="(digito, i) in digitos" :key="i" class="plaquinha" aria-hidden="true">{{ digito }}</span>
    </p>
    <p v-if="descricao" class="descricao">{{ descricao }}</p>
  </article>
</template>

<style scoped>
.ficha {
  position: relative;
  margin-top: 14px; /* espaço para a aba */
  padding: 16px 18px;
  background: var(--surface);
  border-radius: 0 var(--radius-card) var(--radius-card) var(--radius-card);
  box-shadow: var(--shadow-hard);
  display: flex;
  flex-direction: column;
  gap: 10px;
}

/* Aba da pasta, colada no topo esquerdo */
.ficha::before {
  content: '';
  position: absolute;
  left: 0;
  bottom: 100%;
  width: 92px;
  height: 14px;
  background: inherit;
  border-radius: 6px 6px 0 0;
}

.label {
  font-family: var(--font-mono);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: .08em;
  text-transform: uppercase;
  color: var(--accent);
}

.contador {
  display: flex;
  gap: 4px;
}

.plaquinha {
  position: relative;
  padding: 2px 9px;
  background: var(--tile);
  border: 1px solid var(--border);
  border-radius: 6px;
  font-family: var(--font-mono);
  font-size: 32px;
  font-weight: 700;
  line-height: 1.2;
  color: var(--text);
}

/* Linha preta atravessando o meio da plaquinha */
.plaquinha::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  top: 50%;
  height: 1px;
  background: #000;
}

.descricao {
  font-size: 13px;
  color: var(--text-muted);
}

/* Destaque: fundo laranja, todo texto branco */
.destaque {
  background: var(--brand-orange);
}

.destaque .label,
.destaque .descricao {
  color: #fff;
}

.destaque .plaquinha {
  background: #B84800;
  border-color: rgba(0, 0, 0, .15);
}
</style>
