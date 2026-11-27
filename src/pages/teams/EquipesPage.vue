<script setup lang="ts">
import { computed, onMounted } from 'vue'
import AvatarPessoa from '@/components/global/AvatarPessoa.vue'
import BotaoBase from '@/components/global/BotaoBase.vue'
import CabecalhoPagina from '@/components/global/CabecalhoPagina.vue'
import CampoBusca from '@/components/global/CampoBusca.vue'
import EsqueletoBloco from '@/components/global/EsqueletoBloco.vue'
import EstadoErro from '@/components/global/EstadoErro.vue'
import EstadoVazio from '@/components/global/EstadoVazio.vue'
import GrupoPilulas from '@/components/global/GrupoPilulas.vue'
import { useListaEquipes, type FiltroEquipes } from '@/composables/useListaEquipes'
import { corTextoSobre } from '@/utils/cores'
import { mesAno } from '@/utils/datas'

const { carregar, carregando, erro, filtro, busca, total, filtrados, temFiltro, limparFiltros } = useListaEquipes()

onMounted(carregar)

const opcoes: { valor: FiltroEquipes; rotulo: string }[] = [
  { valor: 'todas', rotulo: 'Todas' },
  { valor: 'minhas', rotulo: 'Minhas equipes' },
]

const rotulo = computed(() => `< QUADRO DE EQUIPES /> · ${total.value} EQUIPES`)
</script>

<template>
  <div class="pagina">
    <CabecalhoPagina class="surgir" :rotulo="rotulo" titulo="Equipes da " destaque="Fábrica">
      <template #acoes>
        <CampoBusca v-model="busca" class="busca" placeholder="Buscar equipe..." label="Buscar equipe" />
      </template>
    </CabecalhoPagina>

    <GrupoPilulas v-model="filtro" class="surgir" style="--ordem: 1" :opcoes="opcoes" label="Filtrar equipes" />

    <div v-if="carregando" class="quadro" aria-hidden="true">
      <span class="trilho" />
      <div class="varal">
        <EsqueletoBloco v-for="i in 3" :key="i" class="ficha-esqueleto" altura="190px" raio="12px" />
      </div>
    </div>
    <p v-if="carregando" class="sr-only" role="status">Carregando equipes…</p>

    <EstadoErro v-else-if="erro" :mensagem="erro" @tentar-de-novo="carregar" />

    <EstadoVazio
      v-else-if="!filtrados.length"
      titulo="Nenhuma equipe encontrada."
      :texto="filtro === 'minhas' ? 'Você ainda não faz parte de nenhuma equipe com esse nome.' : 'Tente outra busca.'"
    >
      <BotaoBase v-if="temFiltro" variante="secundario" class="limpar" @click="limparFiltros">Limpar filtros</BotaoBase>
    </EstadoVazio>

    <section v-else class="quadro surgir" style="--ordem: 2" aria-label="Equipes">
      <span class="trilho" aria-hidden="true" />
      <TransitionGroup tag="ul" name="cartao" class="varal">
        <li
          v-for="item in filtrados"
          :key="item.equipe.id"
          class="ficha"
          :style="{ '--cor': item.equipe.cor, '--cor-texto': corTextoSobre(item.equipe.cor) }"
        >
          <span class="cordao" aria-hidden="true" />
          <div class="topo">
            <h2 class="nome">
              <RouterLink :to="{ name: 'equipe', params: { id: item.equipe.id } }" class="esticado">{{ item.equipe.nome }}</RouterLink>
            </h2>
            <span v-if="item.souMembro" class="voce">VOCÊ</span>
          </div>
          <p class="info">{{ item.membros.length }} membros · desde {{ mesAno(item.equipe.desde).toLowerCase() }}</p>
          <div class="avatares" aria-hidden="true">
            <AvatarPessoa
              v-for="membro in item.membros.slice(0, 4)"
              :key="membro.id"
              :nome="membro.nome"
              :iniciais="membro.iniciais"
              :foto="membro.foto"
              cor="#08090A"
              :tamanho="34"
              forma="circulo"
            />
          </div>
          <p v-if="item.projetos" class="projetos">{{ item.projetos }}</p>
        </li>
      </TransitionGroup>
    </section>
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

.limpar {
  margin-top: 8px;
}

/* Quadro de cortiça com um trilho; as fichas ficam penduradas */
.quadro {
  position: relative;
  padding: 18px 24px 32px;
  background: var(--surface-pasta);
  border: 1px solid rgba(0, 0, 0, .4);
  border-radius: var(--radius-menu);
  box-shadow: var(--shadow-hard);
}

.trilho {
  display: block;
  height: 8px;
  border-radius: 4px;
  background: var(--cortica);
  box-shadow: inset 0 2px 0 rgba(0, 0, 0, .35);
}

.varal {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 40px 28px;
  margin: 0;
  padding: 34px 0 0;
  list-style: none;
}

.ficha {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-height: 190px;
  padding: 26px 22px 22px;
  border-radius: var(--radius-menu);
  background: var(--cor);
  color: var(--cor-texto);
  box-shadow: var(--shadow-hard);
  transform: rotate(-1deg);
  transition: transform var(--dur-media) var(--ease-mola), box-shadow var(--dur-media) var(--ease-saida);
}

.ficha:nth-child(even) {
  transform: rotate(1.2deg);
}

.ficha:hover,
.ficha:focus-within {
  transform: rotate(0) translateY(-2px);
  box-shadow: var(--sombra-elevada);
}

/* Cordão do trilho até o alfinete da ficha */
.cordao {
  position: absolute;
  bottom: calc(100% - 10px);
  left: 50%;
  width: 2px;
  height: 44px;
  transform: translateX(-50%);
  background: rgba(255, 255, 255, .35);
}

.cordao::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 50%;
  width: 8px;
  height: 8px;
  transform: translateX(-50%);
  border-radius: 50%;
  background: var(--ink);
}

.topo {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 8px;
}

.nome {
  font-size: 22px;
  font-weight: 700;
  line-height: 1.25;
}

.nome a {
  color: inherit;
  text-decoration: none;
}

.esticado::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: var(--radius-menu);
}

.esticado:focus-visible {
  outline: none;
}

.ficha:has(.esticado:focus-visible) {
  outline: 2px solid var(--text);
  outline-offset: 3px;
}

.voce {
  flex-shrink: 0;
  padding: 2px 10px;
  border: 1.5px solid currentColor;
  border-radius: var(--radius-pill);
  font-family: var(--font-mono);
  font-size: 11px;
  font-weight: 800;
  letter-spacing: .08em;
}

.info {
  font-family: var(--font-mono);
  font-size: 12px;
  font-weight: 600;
  opacity: .85;
}

.avatares {
  display: flex;
}

.avatares > :not(:first-child) {
  margin-left: -8px;
}

.avatares :deep(.circulo) {
  border-color: var(--cor);
}

.projetos {
  margin-top: auto;
  font-size: 14px;
  font-weight: 600;
  opacity: .9;
}

.ficha-esqueleto {
  margin-top: 0;
}
</style>
