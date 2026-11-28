<script setup lang="ts">
import { computed, ref } from 'vue'
import PaginaGestao from '@/components/global/PaginaGestao.vue'
import CartaoSecao from '@/components/global/CartaoSecao.vue'
import EstadoVazio from '@/components/global/EstadoVazio.vue'
import FiltroProjetos from '@/components/tasks/FiltroProjetos.vue'
import LinhaTarefa from '@/components/tasks/LinhaTarefa.vue'
import { fontesGestao, useCargaGestao } from '@/composables/useGestao'
const projeto = ref<number | null>(null)
const { dado, carregando, erro, carregar } = useCargaGestao(async () => {
  const [tarefas, projetos] = await Promise.all([fontesGestao.tarefas(), fontesGestao.projetos()])
  return { tarefas, projetos }
})
const tarefas = computed(() => dado.value?.tarefas.filter((t) => !projeto.value || t.idProjeto === projeto.value) ?? [])
</script>
<template>
  <PaginaGestao titulo="Todas as tarefas" rotulo="GESTÃO" :carregando="carregando" :erro="erro" @recarregar="carregar">
    <CartaoSecao v-if="dado" rotulo="[01] CADERNO DE TAREFAS" variante="caderno" :detalhe="tarefas.length + ' tarefas'">
      <FiltroProjetos v-model="projeto" :projetos="dado.projetos" />
      <ul v-if="tarefas.length">
        <LinhaTarefa
          v-for="t in tarefas"
          :key="t.id"
          :tarefa="t"
          :destinos="[]"
          :nome-projeto="dado.projetos.find((p) => p.id === t.idProjeto)?.nome ?? '—'"
        />
      </ul>
      <EstadoVazio v-else titulo="Nenhuma tarefa neste filtro." />
    </CartaoSecao>
  </PaginaGestao>
</template>
