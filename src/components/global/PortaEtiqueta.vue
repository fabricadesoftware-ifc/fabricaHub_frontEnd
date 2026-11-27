<script setup lang="ts">
defineProps<{ texto: string; id?: string }>()
</script>

<template>
  <div class="porta-etiqueta">
    <h2 :id="id" class="etiqueta">{{ texto }}</h2>
    <span class="traco" aria-hidden="true" />
  </div>
</template>

<style scoped>
.porta-etiqueta {
  display: flex;
  align-items: center;
  gap: 8px;
}

.etiqueta {
  flex-shrink: 0;
  padding: 3px 8px;
  border: 1.5px solid #4A4E55;
  border-radius: 4px;
  background: #111215;
  font-family: var(--font-mono);
  font-size: 10.5px;
  font-weight: 700;
  letter-spacing: .16em;
  color: var(--text-muted);
  line-height: 1.4;
}

.traco {
  flex: 1;
  height: 1px;
  background: var(--border);
}
</style>
