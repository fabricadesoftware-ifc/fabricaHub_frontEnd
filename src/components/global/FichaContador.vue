<script setup lang="ts">
import ContadorMecanico from '@/components/global/ContadorMecanico.vue'

withDefaults(defineProps<{ numero: number; label: string; descricao?: string; destaque?: boolean }>(), {
  descricao: '',
  destaque: false,
})
</script>

<template>
  <article class="ficha" :class="{ destaque }">
    <p class="label">{{ label }}</p>
    <p><ContadorMecanico :numero="numero" :tom="destaque ? 'destaque' : 'normal'" /></p>
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
  color: var(--text);
}
</style>
