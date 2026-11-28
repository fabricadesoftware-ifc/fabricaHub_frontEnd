<script setup lang="ts">
import { computed, onMounted } from 'vue'
import BotaoBase from '@/components/global/BotaoBase.vue'
import CabecalhoPagina from '@/components/global/CabecalhoPagina.vue'
import CampoBusca from '@/components/global/CampoBusca.vue'
import Carimbo from '@/components/global/Carimbo.vue'
import CartaoSecao from '@/components/global/CartaoSecao.vue'
import EsqueletoBloco from '@/components/global/EsqueletoBloco.vue'
import EstadoErro from '@/components/global/EstadoErro.vue'
import EstadoVazio from '@/components/global/EstadoVazio.vue'
import GrupoPilulas from '@/components/global/GrupoPilulas.vue'
import RotuloSecao from '@/components/global/RotuloSecao.vue'
import FolhaCalendario from '@/components/news/FolhaCalendario.vue'
import LinhaNoticia from '@/components/news/LinhaNoticia.vue'
import { CATEGORIAS, useJornal } from '@/composables/useJornal'
import { dataCurta, dataJornal, diaMes, diasAte, lerData, nomeDoDia, nomeMes } from '@/utils/datas'
import type { CategoriaNoticia } from '@/utils/tipos'

defineProps<{ gestao?: boolean }>()

const { carregar, carregando, erro, categoria, busca, destaque, ultimas, maisLidas, agenda, temFiltro, limparFiltros } =
  useJornal()

onMounted(carregar)

const opcoes: { valor: CategoriaNoticia | null; rotulo: string }[] = [
  { valor: null, rotulo: 'Todas' },
  ...CATEGORIAS.map((c) => ({ valor: c, rotulo: c })),
]

const hoje = new Date()
const edicao = `EDIÇÃO Nº ${hoje.getMonth() + 1} · ${nomeMes(hoje)}`

/** "EM 7 DIAS" no carimbo da primeira página (só para evento que ainda vai acontecer). */
const faltam = computed(() => {
  const evento = destaque.value?.evento
  if (!evento) return ''
  const dias = diasAte(evento.data)
  if (dias < 0) return ''
  if (dias === 0) return 'Hoje'
  return dias === 1 ? 'Amanhã' : `Em ${dias} dias`
})

const dataPublicacao = (iso: string) => `${dataCurta(iso)} ${lerData(iso).getFullYear()}`
</script>

<template>
  <div class="pagina">
    <CabecalhoPagina class="surgir" rotulo="< JORNAL DA FÁBRICA />" titulo="Notícias">
      <template #acoes>
        <CampoBusca v-model="busca" class="busca" placeholder="Buscar notícia..." label="Buscar notícia" />
        <BotaoBase v-if="gestao" :para="{ name: 'admin-noticias-criar' }">Nova notícia</BotaoBase>
      </template>
    </CabecalhoPagina>

    <div class="expediente surgir" style="--ordem: 1">
      <span>{{ edicao }}</span>
      <strong class="nome-jornal">JORNAL DA FÁBRICA</strong>
      <span>{{ dataJornal(hoje) }} · ARAQUARI</span>
    </div>

    <GrupoPilulas v-model="categoria" class="surgir" style="--ordem: 2" :opcoes="opcoes" label="Filtrar por categoria" />

    <div v-if="carregando" class="jornal" aria-hidden="true">
      <div class="principal">
        <EsqueletoBloco altura="260px" raio="12px" />
        <EsqueletoBloco altura="380px" raio="12px" />
      </div>
      <div class="lateral">
        <EsqueletoBloco altura="240px" raio="12px" />
        <EsqueletoBloco altura="220px" raio="12px" />
      </div>
    </div>
    <p v-if="carregando" class="sr-only" role="status">Carregando notícias…</p>

    <EstadoErro v-else-if="erro" :mensagem="erro" @tentar-de-novo="carregar" />

    <div v-else class="jornal">
      <div class="principal">
        <EstadoVazio
          v-if="!destaque && !ultimas.length"
          :titulo="temFiltro ? 'Nenhuma notícia encontrada.' : 'Nenhuma notícia ainda.'"
          :texto="temFiltro ? 'Tente outra categoria ou outra busca.' : 'Quando a coordenação publicar, ela aparece aqui.'"
        >
          <BotaoBase v-if="temFiltro" variante="secundario" class="limpar" @click="limparFiltros">Limpar filtros</BotaoBase>
        </EstadoVazio>

        <!-- Primeira página -->
        <article v-if="destaque" class="primeira surgir" style="--ordem: 3">
          <span class="fita esquerda" aria-hidden="true" />
          <span class="fita direita" aria-hidden="true" />
          <div class="primeira-topo">
            <RotuloSecao :rotulo="`[01] PRIMEIRA PÁGINA · ${destaque.categoria}`" />
            <span class="primeira-data">{{ dataPublicacao(destaque.data) }} · {{ destaque.autor.split(' ')[0] }}</span>
          </div>
          <h2 class="manchete">
            <RouterLink :to="{ name: 'noticia', params: { id: destaque.id } }">{{ destaque.titulo }}</RouterLink>
          </h2>
          <div class="colunas-texto">
            <p>{{ destaque.resumo }}</p>
            <p v-if="destaque.blocos[0]">{{ destaque.blocos[0].texto }}</p>
          </div>
          <div class="primeira-rodape">
            <span v-if="destaque.evento" class="quando">
              {{ diaMes(destaque.evento.data) }} · {{ destaque.evento.hora.toUpperCase() }} · {{ destaque.evento.local.split(' ')[0]?.toUpperCase() }}
            </span>
            <RouterLink :to="{ name: 'noticia', params: { id: destaque.id } }" class="ler">Ler notícia →</RouterLink>
            <Carimbo v-if="faltam" :texto="faltam" tipo="devolvido" tamanho="pequeno" class="carimbo" />
          </div>
        </article>

        <!-- Últimas -->
        <CartaoSecao
          v-if="ultimas.length"
          class="surgir"
          style="--ordem: 4"
          rotulo="[02] ÚLTIMAS"
          :detalhe="`${ultimas.length} ${ultimas.length === 1 ? 'NOTÍCIA' : 'NOTÍCIAS'}`"
        >
          <TransitionGroup tag="ul" name="lista" class="lista-ultimas">
            <li v-for="noticia in ultimas" :key="noticia.id">
              <LinhaNoticia :noticia="noticia" />
            </li>
          </TransitionGroup>
        </CartaoSecao>
      </div>

      <aside class="lateral" aria-label="Agenda e mais lidas">
        <section class="agenda surgir" style="--ordem: 4" aria-labelledby="titulo-agenda">
          <RotuloSecao rotulo="[03] AGENDA"><span id="titulo-agenda" class="sr-only">Agenda da Fábrica</span></RotuloSecao>
          <ul v-if="agenda.length" class="lista-agenda">
            <li v-for="(evento, i) in agenda" :key="evento.id" class="evento">
              <FolhaCalendario :data="evento.data" :destaque="i === 0" />
              <div class="evento-textos">
                <p class="evento-titulo">{{ evento.titulo }}</p>
                <p class="evento-meta">{{ [nomeDoDia(evento.data), evento.hora, evento.local].filter(Boolean).join(' · ') }}</p>
              </div>
            </li>
          </ul>
          <p v-else class="vazio-lateral">Nenhum evento marcado.</p>
        </section>

        <CartaoSecao class="surgir" style="--ordem: 5" rotulo="[04] MAIS LIDAS">
          <ol class="mais-lidas">
            <li v-for="(noticia, i) in maisLidas" :key="noticia.id" class="lida">
              <span class="posicao" aria-hidden="true">{{ String(i + 1).padStart(2, '0') }}</span>
              <RouterLink :to="{ name: 'noticia', params: { id: noticia.id } }" class="lida-titulo">{{ noticia.titulo }}</RouterLink>
            </li>
          </ol>
        </CartaoSecao>
      </aside>
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
  width: min(280px, 100%);
}

/* Expediente do jornal: edição, nome e data entre filetes */
.expediente {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: 16px;
  padding: 12px 0;
  border-top: 3px double rgba(255, 255, 255, .18);
  border-bottom: 1px solid rgba(255, 255, 255, .12);
  font-family: var(--font-mono);
  font-size: 10.5px;
  font-weight: 700;
  letter-spacing: .12em;
  color: var(--text-subtle);
}

.expediente > :last-child {
  text-align: right;
}

.nome-jornal {
  font-size: 15px;
  font-weight: 800;
  letter-spacing: .2em;
  color: var(--text);
}

.jornal {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 300px);
  align-items: start;
  gap: 20px;
}

.principal,
.lateral {
  display: flex;
  flex-direction: column;
  gap: 20px;
  min-width: 0;
}

.limpar {
  margin-top: 8px;
}

/* Primeira página: recorte preso com fita */
.primeira {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 8px;
  padding: 24px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-btn);
  box-shadow: var(--shadow-hard);
}

.fita {
  position: absolute;
  top: -8px;
  width: 56px;
  height: 16px;
  background: var(--cortica);
  opacity: .9;
}

.fita.esquerda {
  left: 24px;
  transform: rotate(-4deg);
}

.fita.direita {
  right: 24px;
  transform: rotate(5deg);
}

.primeira-topo {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.primeira-data {
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--text-subtle);
}

.manchete {
  max-width: 22ch;
  font-size: clamp(26px, 3.4vw, 36px);
  font-weight: 700;
  line-height: 1.15;
}

.manchete a {
  color: var(--text);
  text-decoration: none;
}

.manchete a:hover {
  text-decoration: underline;
}

.colunas-texto {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 24px;
  font-size: 14px;
  line-height: 1.6;
  color: var(--text-muted);
}

.colunas-texto p + p {
  padding-left: 24px;
  border-left: 1px solid var(--border);
}

.primeira-rodape {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px 20px;
}

.quando {
  padding: 4px 12px;
  border: 1px solid rgba(255, 255, 255, .12);
  border-radius: var(--radius-pill);
  font-family: var(--font-mono);
  font-size: 10.5px;
  font-weight: 700;
  letter-spacing: .08em;
}

.ler {
  display: inline-flex;
  align-items: center;
  min-height: 32px;
  font-size: 13px;
  font-weight: 600;
  color: var(--accent);
  text-decoration: none;
}

.ler:hover {
  text-decoration: underline;
}

.carimbo {
  margin-left: auto;
}

/* Últimas */
.lista-ultimas {
  margin: 0;
  padding: 0;
  list-style: none;
}

.lista-ultimas > li + li {
  border-top: 1px solid var(--border);
}

/* Agenda: pasta parda */
.agenda {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 18px;
  background: var(--surface-pasta);
  border: 1px solid rgba(255, 255, 255, .06);
  border-radius: var(--radius-menu);
  box-shadow: var(--shadow-hard);
}

.lista-agenda {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.evento {
  display: flex;
  align-items: center;
  gap: 12px;
}

.evento-textos {
  min-width: 0;
}

.evento-titulo {
  font-size: 13.5px;
  font-weight: 600;
  line-height: 1.35;
}

.evento-meta {
  font-size: 12px;
  color: var(--text-muted);
}

.vazio-lateral {
  font-size: 13px;
  color: var(--text-muted);
}

/* Mais lidas */
.mais-lidas {
  margin: 0;
  padding: 0;
  list-style: none;
}

.lida {
  display: flex;
  align-items: center;
  gap: 12px;
  min-height: 52px;
  padding: 8px 0;
}

.lida + .lida {
  border-top: 1px solid var(--border);
}

.posicao {
  flex-shrink: 0;
  display: grid;
  place-items: center;
  width: 28px;
  height: 28px;
  border-radius: 4px;
  background: var(--surface-2);
  font-family: var(--font-mono);
  font-size: 11px;
  font-weight: 700;
  color: var(--accent);
}

.lida-titulo {
  font-size: 13px;
  font-weight: 600;
  line-height: 1.35;
  color: var(--text);
  text-decoration: none;
}

.lida-titulo:hover {
  text-decoration: underline;
}

@media (max-width: 899px) {
  .jornal {
    grid-template-columns: minmax(0, 1fr);
  }

  .expediente {
    grid-template-columns: 1fr;
    gap: 4px;
    text-align: center;
  }

  .expediente > :last-child {
    text-align: center;
  }

  .nome-jornal {
    order: -1;
  }

  .colunas-texto {
    grid-template-columns: minmax(0, 1fr);
    gap: 12px;
  }

  .colunas-texto p + p {
    padding-left: 0;
    border-left: 0;
  }
}
</style>
