<script setup lang="ts">
withDefaults(defineProps<{ titulo: string; texto?: string; compacto?: boolean }>(), {
  texto: '',
  compacto: false,
})
</script>

<template>
  <div class="estado-vazio" :class="{ compacto }">
    <span class="marca" aria-hidden="true">[ ]</span>
    <p class="titulo">{{ titulo }}</p>
    <p v-if="texto" class="texto">{{ texto }}</p>
    <slot />
  </div>
</template>

<style scoped>
.estado-vazio {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 32px 16px;
  border: 1px dashed rgba(255, 255, 255, .12);
  border-radius: var(--radius-btn);
  text-align: center;
}

.compacto {
  padding: 16px 12px;
}

.marca {
  font-family: var(--font-mono);
  font-size: 13px;
  font-weight: 700;
  color: var(--text-subtle);
}

.titulo {
  font-size: 14px;
  font-weight: 600;
}

.compacto .titulo {
  font-size: 13px;
}

.texto {
  max-width: 320px;
  font-size: 13px;
  color: var(--text-muted);
}

.estado-vazio {
  animation: surgir var(--dur-lenta) var(--ease-saida) backwards;
}
</style>
