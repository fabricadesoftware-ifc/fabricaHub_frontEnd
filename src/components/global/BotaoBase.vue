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
    /** Com `href`, vira um link externo (abre em nova aba). */
    href?: string
  }>(),
  { variante: 'primario', tipo: 'button', bloco: false, para: undefined, href: undefined },
)
</script>

<template>
  <RouterLink v-if="para" :to="para" class="botao" :class="[variante, { bloco }]">
    <slot />
  </RouterLink>
  <a v-else-if="href" :href="href" target="_blank" rel="noopener noreferrer" class="botao" :class="[variante, { bloco }]">
    <slot />
  </a>
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

.botao {
  transition: transform var(--dur-rapida) var(--ease-saida), box-shadow var(--dur-rapida) var(--ease-saida),
    background-color var(--dur-media), border-color var(--dur-media), opacity var(--dur-media);
}

.primario:not(:disabled):hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 0 #8A3205;
}

.secundario:not(:disabled):hover {
  background: rgba(255, 255, 255, .04);
}

/* Clique "afunda" o botão mesmo com o mouse em cima */
.primario:not(:disabled):hover:active {
  transform: translateY(3px);
  box-shadow: 0 0 0 #8A3205;
}
</style>
