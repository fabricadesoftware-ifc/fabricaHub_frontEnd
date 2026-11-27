<script setup lang="ts" generic="T extends string | null">
/** Filtro em pílulas (só uma ativa). Cada botão tem `aria-pressed`. */
defineProps<{ opcoes: { valor: T; rotulo: string }[]; label: string }>()

const modelo = defineModel<T>({ required: true })
</script>

<template>
  <div class="grupo-pilulas" role="group" :aria-label="label">
    <button
      v-for="opcao in opcoes"
      :key="String(opcao.valor)"
      type="button"
      class="pilula"
      :class="{ ativa: modelo === opcao.valor }"
      :aria-pressed="modelo === opcao.valor"
      @click="modelo = opcao.valor"
    >
      {{ opcao.rotulo }}
    </button>
  </div>
</template>

<style scoped>
.grupo-pilulas {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.pilula {
  display: inline-flex;
  align-items: center;
  min-height: 44px;
  padding: 0 16px;
  border: 1px solid rgba(255, 255, 255, .12);
  border-radius: var(--radius-btn);
  background: var(--surface);
  color: var(--text);
  font-size: 12.5px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color var(--dur-media), color var(--dur-media), border-color var(--dur-media),
    transform var(--dur-rapida);
}

.pilula:hover {
  border-color: rgba(255, 255, 255, .24);
}

.pilula.ativa {
  background: var(--text);
  border-color: var(--text);
  color: var(--ink);
}

.pilula:active {
  transform: scale(.96);
}
</style>
