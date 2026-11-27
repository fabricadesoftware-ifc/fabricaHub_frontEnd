<script setup lang="ts">
import { onBeforeUnmount, onMounted, useTemplateRef } from 'vue'
import IconeSvg from '@/components/global/IconeSvg.vue'

withDefaults(defineProps<{ placeholder?: string; label?: string }>(), {
  placeholder: 'Buscar tarefas, projetos, pessoas…',
  label: 'Buscar',
})

const modelo = defineModel<string>({ default: '' })
const campo = useTemplateRef<HTMLInputElement>('campo')

// Atalho Ctrl K (ou ⌘K) foca o campo.
function aoTeclar(evento: KeyboardEvent) {
  if ((evento.ctrlKey || evento.metaKey) && evento.key.toLowerCase() === 'k') {
    evento.preventDefault()
    campo.value?.focus()
  }
}

onMounted(() => window.addEventListener('keydown', aoTeclar))
onBeforeUnmount(() => window.removeEventListener('keydown', aoTeclar))
</script>

<template>
  <label class="campo-busca">
    <span class="sr-only">{{ label }}</span>
    <IconeSvg nome="busca" class="lupa" />
    <input ref="campo" v-model="modelo" type="search" :placeholder="placeholder" />
    <kbd class="atalho">Ctrl K</kbd>
  </label>
</template>

<style scoped>
.campo-busca {
  display: flex;
  align-items: center;
  gap: 10px;
  height: 44px;
  padding: 0 10px 0 14px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-btn);
  cursor: text;
}

.campo-busca:focus-within {
  border-color: var(--accent);
}

.lupa {
  flex-shrink: 0;
  color: var(--text-subtle);
}

input {
  flex: 1;
  min-width: 0;
  height: 100%;
  background: transparent;
  border: 0;
  outline: 0;
  font-size: 14px;
}

input::placeholder {
  color: var(--text-subtle);
}

.atalho {
  flex-shrink: 0;
  padding: 2px 6px;
  border: 1px solid rgba(255, 255, 255, .12);
  border-radius: 4px;
  background: var(--tile);
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--text-muted);
}
</style>
