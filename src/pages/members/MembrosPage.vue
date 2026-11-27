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
import CrachaMembro from '@/components/members/CrachaMembro.vue'
import { useListaMembros, type FiltroStatusMembro } from '@/composables/useListaMembros'
import { cursoCurto } from '@/utils/pessoas'

const { carregar, carregando, erro, status, curso, area, busca, cursos, areas, total, filtrados, temFiltro, limparFiltros } =
  useListaMembros()

onMounted(carregar)

const opcoesStatus: { valor: FiltroStatusMembro; rotulo: string }[] = [
  { valor: 'ativos', rotulo: 'Ativos' },
  { valor: 'inativos', rotulo: 'Inativos' },
  { valor: 'todos', rotulo: 'Todos' },
]

const rotulo = computed(() => `< MEMBROS /> · ${total.value} PESSOAS`)
</script>

<template>
  <div class="pagina">
    <CabecalhoPagina class="surgir" :rotulo="rotulo" titulo="Quem faz a " destaque="Fábrica">
      <template #acoes>
        <CampoBusca v-model="busca" class="busca" placeholder="Buscar por nome ou @usuário" label="Buscar por nome ou @usuário" />
      </template>
    </CabecalhoPagina>

    <div class="filtros surgir" style="--ordem: 1">
      <GrupoPilulas v-model="status" :opcoes="opcoesStatus" label="Filtrar por situação" />
      <div class="selects">
        <CampoSelect v-model="curso" label="Curso" :opcoes="cursos" vazio="Todos" />
        <CampoSelect v-model="area" label="Área" :opcoes="areas" vazio="Todas" />
      </div>
    </div>

    <div v-if="carregando" class="grade" aria-hidden="true">
      <div v-for="i in 8" :key="i" class="cracha-esqueleto">
        <EsqueletoBloco largura="40px" altura="40px" raio="8px" />
        <EsqueletoBloco largura="60%" altura="13px" />
        <EsqueletoBloco largura="40%" altura="10px" />
        <EsqueletoBloco largura="70%" altura="10px" />
      </div>
    </div>
    <p v-if="carregando" class="sr-only" role="status">Carregando membros…</p>

    <EstadoErro v-else-if="erro" :mensagem="erro" @tentar-de-novo="carregar" />

    <EstadoVazio
      v-else-if="!filtrados.length"
      titulo="Ninguém encontrado."
      :texto="temFiltro ? 'Confira a busca ou mude os filtros.' : 'Ainda não há pessoas cadastradas.'"
    >
      <BotaoBase v-if="temFiltro" variante="secundario" class="limpar" @click="limparFiltros">Limpar filtros</BotaoBase>
    </EstadoVazio>

    <TransitionGroup v-else tag="ul" name="cartao" class="grade">
      <li v-for="(item, i) in filtrados" :key="item.usuario.id" class="surgir" :style="{ '--ordem': i + 2 }">
        <CrachaMembro
          :nome="item.usuario.nome"
          :usuario="item.usuario.usuario"
          :curso="cursoCurto(item.usuario.curso)"
          :papel="item.papel"
          :cor="item.usuario.cor"
          :iniciais="item.usuario.iniciais"
          :foto="item.usuario.foto"
          :ativo="item.usuario.ativo"
          :para="{ name: 'membro', params: { id: item.usuario.id } }"
        />
      </li>
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
  width: min(300px, 100%);
}

.filtros {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.selects {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.grade {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(190px, 1fr));
  gap: 20px 16px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.grade > li {
  display: flex;
  flex-direction: column;
}

.grade > li > * {
  flex: 1;
}

.cracha-esqueleto {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  margin-top: 8px;
  padding: 26px 14px 40px;
  border-top: 10px solid var(--surface-2);
  border-radius: var(--radius-menu);
  background: var(--surface);
}

.limpar {
  margin-top: 8px;
}
</style>
