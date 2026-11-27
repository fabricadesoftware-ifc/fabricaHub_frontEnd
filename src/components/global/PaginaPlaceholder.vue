<script setup lang="ts">
defineProps<{ titulo: string }>()
</script>

<template>
  <section class="pagina-placeholder">
    <h1>{{ titulo }}</h1>
    <p>Página em construção.</p>
  </section>
</template>

<style scoped>
.pagina-placeholder {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

h1 {
  font-size: 24px;
  font-weight: 600;
}

p {
  font-size: 14px;
  color: var(--text-muted);
}
</style>
