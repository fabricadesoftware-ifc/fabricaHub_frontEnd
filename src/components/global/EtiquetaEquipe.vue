<script setup lang="ts">
import type { RouteLocationRaw } from 'vue-router'

/** Linha "■ Front-end ........ MAR/25 → ATUAL": quadradinho na cor, nome (link opcional) e detalhe à direita. */
withDefaults(defineProps<{ nome: string; cor: string; para?: RouteLocationRaw; detalhe?: string }>(), {
  para: undefined,
  detalhe: '',
})
</script>

<template>
  <div class="etiqueta-equipe">
    <span class="quadrado" :style="{ background: cor }" aria-hidden="true" />
    <RouterLink v-if="para" :to="para" class="nome">{{ nome }}</RouterLink>
    <span v-else class="nome">{{ nome }}</span>
    <span v-if="detalhe" class="detalhe">{{ detalhe }}</span>
  </div>
</template>

<style scoped>
.etiqueta-equipe {
  display: flex;
  align-items: center;
  gap: 10px;
  min-height: 36px;
}

.quadrado {
  flex-shrink: 0;
  width: 8px;
  height: 8px;
  border-radius: 2px;
}

.nome {
  flex: 1;
  min-width: 0;
  font-size: 13px;
  font-weight: 600;
  color: var(--text);
  text-decoration: none;
}

a.nome:hover {
  text-decoration: underline;
}

.detalhe {
  flex-shrink: 0;
  font-family: var(--font-mono);
  font-size: 10.5px;
  font-weight: 700;
  letter-spacing: .06em;
  color: var(--text-subtle);
}
</style>
