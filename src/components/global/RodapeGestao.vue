<script setup lang="ts">
import BotaoBase from './BotaoBase.vue'
defineProps<{ ocupado: boolean; aviso: string; volta: string; excluir?: boolean }>()
defineEmits<{ remover: [] }>()
</script>
<template>
  <footer>
    <p v-if="aviso" class="alerta" role="alert">{{ aviso }}</p>
    <div class="botoes">
      <BotaoBase v-if="excluir" variante="perigo" :disabled="ocupado" @click="$emit('remover')">Excluir</BotaoBase>
      <BotaoBase v-if="!ocupado" variante="secundario" :para="{ name: volta }">Cancelar</BotaoBase>
      <BotaoBase tipo="submit" :disabled="ocupado">{{ ocupado ? 'Salvando…' : 'Salvar' }}</BotaoBase>
    </div>
  </footer>
</template>
