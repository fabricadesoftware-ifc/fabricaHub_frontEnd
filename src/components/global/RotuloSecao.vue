<script setup lang="ts">
withDefaults(
  defineProps<{
    rotulo?: string
    titulo?: string
    nivel?: 'h1' | 'h2'
    /** `grande` para títulos de página (ex.: 404). */
    tamanho?: 'normal' | 'grande'
    /** `perigo` deixa o rótulo vermelho (ex.: 403). */
    tom?: 'accent' | 'perigo'
  }>(),
  { rotulo: '', titulo: '', nivel: 'h2', tamanho: 'normal', tom: 'accent' },
)
</script>

<template>
  <div class="rotulo-secao" :class="[tamanho, tom]">
    <span class="rotulo"><slot name="rotulo">{{ rotulo }}</slot></span>
    <component :is="nivel" v-if="titulo || $slots.default" class="titulo"><slot>{{ titulo }}</slot></component>
  </div>
</template>

<style scoped>
.rotulo-secao {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.rotulo {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-family: var(--font-mono);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: .14em;
  text-transform: uppercase;
  color: var(--accent);
}

.perigo .rotulo {
  color: var(--brand-red);
}

.titulo {
  font-size: 18px;
  font-weight: 600;
  line-height: 1.3;
}

.grande {
  gap: 10px;
}

.grande .titulo {
  font-size: clamp(30px, 5vw, 44px);
  font-weight: 700;
  line-height: 1.15;
}
</style>
