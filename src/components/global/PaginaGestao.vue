<script setup lang="ts">
import CabecalhoPagina from './CabecalhoPagina.vue'
import EstadoErro from './EstadoErro.vue'
import EstadoVazio from './EstadoVazio.vue'
import EsqueletoBloco from './EsqueletoBloco.vue'
defineProps<{ titulo: string; rotulo: string; carregando: boolean; erro: string | null; vazio?: string }>()
defineEmits<{ recarregar: [] }>()
</script>
<template>
  <div class="gestao surgir">
    <CabecalhoPagina :rotulo="'< ' + rotulo + ' />'" :titulo="titulo" destaque="_">
      <template v-if="$slots.acoes" #acoes><slot name="acoes" /></template>
    </CabecalhoPagina>
    <div v-if="carregando" aria-busy="true" aria-label="Carregando"><EsqueletoBloco altura="160px" /></div>
    <EstadoErro v-else-if="erro" :mensagem="erro" @tentar-de-novo="$emit('recarregar')" />
    <EstadoVazio v-else-if="vazio" :titulo="vazio" />
    <slot v-else />
  </div>
</template>
<style src="@/styles/gestao.css"></style>
