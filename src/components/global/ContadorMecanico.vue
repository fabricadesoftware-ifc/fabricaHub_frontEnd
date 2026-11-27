<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    numero: number
    /** Mínimo de dígitos (completa com zeros à esquerda). */
    digitos?: number
    tamanho?: 'normal' | 'pequeno'
    /** `destaque` para usar sobre fundo laranja. */
    tom?: 'normal' | 'destaque'
  }>(),
  { digitos: 2, tamanho: 'normal', tom: 'normal' },
)

const lista = computed(() =>
  String(Math.max(0, Math.trunc(props.numero))).padStart(props.digitos, '0').split(''),
)
</script>

<template>
  <span class="contador" :class="[tamanho, tom]">
    <span class="sr-only">{{ numero }}</span>
    <span v-for="(digito, i) in lista" :key="i" class="plaquinha" aria-hidden="true">{{ digito }}</span>
  </span>
</template>

<style scoped>
.contador {
  display: inline-flex;
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

.pequeno {
  gap: 3px;
}

.pequeno .plaquinha {
  padding: 1px 5px;
  border-radius: 4px;
  font-size: 17px;
}

.destaque .plaquinha {
  background: #B84800;
  border-color: rgba(0, 0, 0, .15);
}
</style>
