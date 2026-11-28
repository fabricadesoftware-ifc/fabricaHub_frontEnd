<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import CabecalhoPagina from '@/components/global/CabecalhoPagina.vue'
import EsqueletoBloco from '@/components/global/EsqueletoBloco.vue'
import CampoBusca from '@/components/global/CampoBusca.vue'
import EstadoErro from '@/components/global/EstadoErro.vue'
import EstadoVazio from '@/components/global/EstadoVazio.vue'
import IconeSvg from '@/components/global/IconeSvg.vue'
import CartaoTarefa from '@/components/tasks/CartaoTarefa.vue'
import ColunaQuadro from '@/components/tasks/ColunaQuadro.vue'
import EsqueletoQuadro from '@/components/tasks/EsqueletoQuadro.vue'
import FiltroProjetos from '@/components/tasks/FiltroProjetos.vue'
import { useMoverTarefa } from '@/composables/useMoverTarefa'
import { useQuadroTarefas } from '@/composables/useQuadroTarefas'
import { useProjetosStore } from '@/stores/projetos'
import { dataCabecalho } from '@/utils/datas'
import type { StatusTarefa, Tarefa } from '@/utils/tipos'

const props = defineProps<{ gestao?: boolean }>()

const rota = useRoute()
const projetos = useProjetosStore()
const { carregando, erro, carregar, tentarDeNovo, filtroProjeto, busca, projetosDoFiltro, temTarefas, colunas } =
  useQuadroTarefas(props.gestao)
const { movendo, erroMover, destinos, mover } = useMoverTarefa()

// Busca vinda do dashboard (?busca=...)
if (typeof rota.query.busca === 'string') busca.value = rota.query.busca

onMounted(carregar)

const aviso = ref('')

async function moverTarefa(tarefa: Tarefa, para: StatusTarefa) {
  const atualizada = await mover(tarefa, para)
  if (atualizada) aviso.value = `"${atualizada.titulo}" foi para ${para}.`
}

function projetoDe(id: number) {
  return projetos.lista.find((p) => p.id === id) ?? null
}
</script>

<template>
  <div class="pagina">
    <CabecalhoPagina class="surgir" :rotulo="`< QUADRO DE TAREFAS /> · ${dataCabecalho()}`" :titulo="gestao ? 'Todas as ' : 'Minhas '" destaque="tarefas">
      <template #acoes>
        <CampoBusca v-model="busca" class="busca" placeholder="Buscar tarefa ou branch..." label="Buscar tarefa ou branch" />
      </template>
    </CabecalhoPagina>

    <div class="barra surgir" style="--ordem: 1">
      <!-- Os chips dependem das tarefas: enquanto carrega, viram skeleton -->
      <div v-if="carregando" class="chips-esqueleto" aria-hidden="true">
        <EsqueletoBloco v-for="largura in ['72px', '150px', '104px', '112px']" :key="largura" :largura="largura" altura="36px" raio="999px" />
      </div>
      <FiltroProjetos v-else v-model="filtroProjeto" :projetos="projetosDoFiltro" />
      <p v-if="!gestao" class="regra">
        <IconeSvg nome="info" :tamanho="14" />
        Você move suas tarefas até "Em revisão". Quem conclui é o líder do projeto.
      </p>
    </div>

    <p v-if="erroMover" class="erro-mover" role="alert">{{ erroMover }}</p>
    <p class="sr-only" role="status">{{ aviso }}</p>

    <EsqueletoQuadro v-if="carregando" />
    <p v-if="carregando" class="sr-only" role="status">Carregando tarefas…</p>
    <EstadoErro v-else-if="erro" :mensagem="erro" @tentar-de-novo="tentarDeNovo" />
    <EstadoVazio
      v-else-if="!temTarefas"
      :titulo="gestao ? 'Nenhuma tarefa cadastrada.' : 'Você ainda não tem tarefas.'"
      :texto="gestao ? '' : 'Quando o líder do projeto te passar uma tarefa, ela aparece em A fazer.'"
    />
    <div v-else class="quadro">
      <ColunaQuadro
        v-for="(coluna, i) in colunas"
        class="surgir"
        :style="{ '--ordem': i + 2 }"
        :key="coluna.status"
        :titulo="coluna.titulo"
        :status="coluna.status"
        :quantidade="coluna.tarefas.length"
      >
        <TransitionGroup name="cartao" tag="div" class="lista-cartoes">
          <CartaoTarefa
          v-for="tarefa in coluna.tarefas"
          :key="tarefa.id"
          :tarefa="tarefa"
          :projeto="projetoDe(tarefa.idProjeto)"
          :destinos="gestao ? [] : destinos(tarefa)"
          :movendo="movendo === tarefa.id"
          @mover="moverTarefa(tarefa, $event)"
          />
        </TransitionGroup>
      </ColunaQuadro>
    </div>
  </div>
</template>

<style scoped>
.pagina {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.busca {
  width: min(340px, 100%);
}

.barra {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.chips-esqueleto {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.regra {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: var(--text-muted);
}

.erro-mover {
  padding: 10px 14px;
  border: 1px solid rgba(255, 32, 32, .35);
  border-radius: var(--radius-btn);
  font-size: 13px;
  color: var(--brand-red);
}

.lista-cartoes {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.quadro {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  align-items: start;
  gap: 16px;
}
</style>
