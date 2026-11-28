<script setup lang="ts" generic="T extends string | null">
/**
 * Escolha única em pílulas (só uma ativa). Cada botão tem `aria-pressed`.
 * `segmentado`: botões colados numa barra só (ex.: prioridade Baixa / Média / Alta num formulário).
 */
withDefaults(defineProps<{ opcoes: { valor: T; rotulo: string }[]; label: string; variante?: 'pilulas' | 'segmentado' }>(), {
  variante: 'pilulas',
})

const modelo = defineModel<T>({ required: true })
</script>

<template>
  <div class="grupo-pilulas" :class="variante" role="group" :aria-label="label">
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

/* Segmentado: uma barra com as opções lado a lado */
.segmentado {
  flex-wrap: nowrap;
  gap: 4px;
  padding: 4px;
  border: 1px solid var(--border);
  border-radius: var(--radius-btn);
  background: var(--ink);
}

.segmentado .pilula {
  flex: 1;
  justify-content: center;
  min-height: 36px;
  border-color: transparent;
  border-radius: 6px;
  background: transparent;
  color: var(--text-muted);
}

.segmentado .pilula:hover {
  color: var(--text);
}

.segmentado .pilula.ativa {
  border-color: var(--border);
  background: var(--surface-2);
  color: var(--text);
}
</style>
