<script setup lang="ts">
import type { RouteLocationRaw } from 'vue-router'

withDefaults(
  defineProps<{
    variante?: 'primario' | 'secundario'
    tipo?: 'button' | 'submit' | 'reset'
    /** Ocupa a largura toda. */
    bloco?: boolean
    /** Com `para`, vira um link de navegação (RouterLink) com a mesma aparência. */
    para?: RouteLocationRaw
  }>(),
  { variante: 'primario', tipo: 'button', bloco: false, para: undefined },
)
</script>

<template>
  <RouterLink v-if="para" :to="para" class="botao" :class="[variante, { bloco }]">
    <slot />
  </RouterLink>
  <button v-else :type="tipo" class="botao" :class="[variante, { bloco }]">
    <slot />
  </button>
</template>

<style scoped>
.botao {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 44px;
  padding: 0 20px;
  border-radius: var(--radius-btn);
  font-family: var(--font-ui);
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
  cursor: pointer;
  transition: transform .08s, box-shadow .08s;
}

.bloco {
  display: flex;
  width: 100%;
}

.primario {
  background: var(--brand-orange);
  color: var(--text);
  border: 0;
  box-shadow: 0 3px 0 #8A3205;
}

.primario:active {
  transform: translateY(3px);
  box-shadow: 0 0 0 #8A3205;
}

.secundario {
  background: transparent;
  color: var(--text);
  border: 1px solid rgba(255, 255, 255, .12);
}

.secundario:hover {
  border-color: rgba(255, 255, 255, .24);
}

.botao:disabled {
  opacity: .7;
  cursor: progress;
}

.botao:disabled:active {
  transform: none;
}
</style>
