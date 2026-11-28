<script setup lang="ts">
import { computed, onMounted } from 'vue'
import BotaoBase from '@/components/global/BotaoBase.vue'
import CabecalhoPagina from '@/components/global/CabecalhoPagina.vue'
import CampoBusca from '@/components/global/CampoBusca.vue'
import CampoSelect from '@/components/global/CampoSelect.vue'
import EsqueletoBloco from '@/components/global/EsqueletoBloco.vue'
import EstadoErro from '@/components/global/EstadoErro.vue'
import EstadoVazio from '@/components/global/EstadoVazio.vue'
import GrupoPilulas from '@/components/global/GrupoPilulas.vue'
import CartaoProjeto from '@/components/projects/CartaoProjeto.vue'
import { STATUS_PROJETO, useListaProjetos } from '@/composables/useListaProjetos'
import type { StatusProjeto } from '@/utils/tipos'

defineProps<{ gestao?: boolean }>()

const {
  carregar,
  carregando,
  erro,
  status,
  tecnologia,
  soMeus,
  busca,
  tecnologias,
  total,
  filtrados,
  temFiltro,
  limparFiltros,
} = useListaProjetos()

onMounted(carregar)

const opcoesStatus: { valor: StatusProjeto | null; rotulo: string }[] = [
  { valor: null, rotulo: 'Todos' },
  ...STATUS_PROJETO.map((s) => ({ valor: s, rotulo: s })),
]

const rotulo = computed(() => `< ARQUIVO DE PROJETOS /> · ${total.value} PROJETOS`)
</script>

<template>
  <div class="pagina">
    <CabecalhoPagina class="surgir" :rotulo="rotulo" titulo="Todos os " destaque="projetos">
      <template #acoes>
        <CampoBusca v-model="busca" class="busca" placeholder="Buscar projeto..." label="Buscar projeto" />
        <BotaoBase v-if="gestao" :para="{ name: 'admin-projetos-criar' }">Novo projeto</BotaoBase>
      </template>
    </CabecalhoPagina>

    <div class="filtros surgir" style="--ordem: 1">
      <GrupoPilulas v-model="status" :opcoes="opcoesStatus" label="Filtrar por status" />
      <div class="filtros-direita">
        <CampoSelect v-model="tecnologia" label="Tecnologia" :opcoes="tecnologias" vazio="Todas" />
        <button type="button" class="alternar" :class="{ ativo: soMeus }" :aria-pressed="soMeus" @click="soMeus = !soMeus">
          Só os meus
        </button>
      </div>
    </div>

    <div v-if="carregando" class="grade" aria-hidden="true">
      <div v-for="i in 6" :key="i" class="esqueleto-cartao">
        <EsqueletoBloco largura="60%" altura="16px" />
        <EsqueletoBloco largura="90%" altura="11px" />
        <EsqueletoBloco largura="70%" altura="11px" />
        <div class="linha"><EsqueletoBloco largura="44px" altura="16px" /><EsqueletoBloco largura="56px" altura="16px" /></div>
        <EsqueletoBloco largura="100%" altura="14px" />
      </div>
    </div>
    <p v-if="carregando" class="sr-only" role="status">Carregando projetos…</p>

    <EstadoErro v-else-if="erro" :mensagem="erro" @tentar-de-novo="carregar" />

    <EstadoVazio
      v-else-if="!filtrados.length"
      titulo="Nenhum projeto encontrado."
      :texto="temFiltro ? 'Tente outro filtro ou outra busca.' : 'Ainda não há projetos cadastrados.'"
    >
      <BotaoBase v-if="temFiltro" variante="secundario" class="limpar" @click="limparFiltros">Limpar filtros</BotaoBase>
    </EstadoVazio>

    <TransitionGroup v-else tag="div" name="cartao" class="grade">
      <CartaoProjeto
        v-for="(item, i) in filtrados"
        :key="item.projeto.id"
        class="surgir"
        :style="{ '--ordem': i + 2 }"
        :projeto="item.projeto"
        pardo
        mostrar-resumo
      >
        <template #rodape>
          <span>Líder: <strong>{{ item.lider }}</strong> · {{ item.projeto.membros.length }} membros</span>
          <span v-if="item.minhaFuncao" class="realce">Você: {{ item.minhaFuncao }}</span>
        </template>
      </CartaoProjeto>
    </TransitionGroup>
  </div>
</template>

<style scoped>
.pagina {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.busca {
  width: min(280px, 100%);
}

.filtros {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.filtros-direita {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
}

.alternar {
  min-height: 44px;
  padding: 0 16px;
  border: 1px solid rgba(255, 255, 255, .12);
  border-radius: var(--radius-btn);
  background: var(--surface);
  font-size: 12.5px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color var(--dur-media), color var(--dur-media), border-color var(--dur-media);
}

.alternar:hover {
  border-color: rgba(255, 255, 255, .24);
}

.alternar.ativo {
  background: var(--text);
  border-color: var(--text);
  color: var(--ink);
}

.grade {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  align-items: stretch;
  gap: 20px 16px;
}

.esqueleto-cartao {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 15px;
  padding: 16px;
  background: var(--surface-pasta);
  border-radius: 0 var(--radius-btn) var(--radius-btn) var(--radius-btn);
}

.esqueleto-cartao :deep(.esqueleto) {
  background: var(--surface-2);
}

.linha {
  display: flex;
  gap: 6px;
}

.limpar {
  margin-top: 8px;
}
</style>
