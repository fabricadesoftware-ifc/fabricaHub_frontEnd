<script setup lang="ts">
/** Balão de uma mensagem na conversa. `minha` alinha à direita com a borda laranja. */
defineProps<{ autor: string; hora: string; texto: string; minha: boolean }>()
</script>

<template>
  <li class="balao" :class="{ minha }">
    <p class="topo">
      <span class="autor">{{ autor }}</span>
      <span class="hora">{{ hora }}</span>
    </p>
    <p class="texto">{{ texto }}</p>
  </li>
</template>

<style scoped>
.balao {
  display: flex;
  flex-direction: column;
  gap: 4px;
  max-width: min(440px, 85%);
  padding: 8px 12px 12px;
  border: 1px solid var(--border);
  border-radius: 4px var(--radius-menu) var(--radius-menu) var(--radius-menu);
  background: var(--surface-2);
}

.minha {
  align-self: flex-end;
  border-color: rgba(255, 102, 0, .35);
  border-radius: var(--radius-menu) 4px var(--radius-menu) var(--radius-menu);
  background: var(--surface-pasta);
}

.topo {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 16px;
}

.autor {
  font-size: 11.5px;
  font-weight: 600;
  color: var(--text-muted);
}

.hora {
  font-family: var(--font-mono);
  font-size: 10.5px;
  color: var(--text-subtle);
}

.texto {
  font-size: 13.5px;
  line-height: 1.5;
  overflow-wrap: anywhere;
  white-space: pre-line;
}
</style>
