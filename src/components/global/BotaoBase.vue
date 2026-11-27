<script setup lang="ts">
withDefaults(
  defineProps<{ variante?: 'primario' | 'secundario'; tipo?: 'button' | 'submit' | 'reset' }>(),
  { variante: 'primario', tipo: 'button' },
)
</script>

<template>
  <button :type="tipo" class="botao" :class="variante">
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
  cursor: pointer;
  transition: transform .08s, box-shadow .08s;
}

.primario {
  background: var(--brand-orange);
  color: #fff;
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
  opacity: .5;
  cursor: not-allowed;
}
</style>
