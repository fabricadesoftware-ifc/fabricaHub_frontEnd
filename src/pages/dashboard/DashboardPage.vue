<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import AgendaSemana from '@/components/dashboard/AgendaSemana.vue'
import EsqueletoDashboard from '@/components/dashboard/EsqueletoDashboard.vue'
import ItemAtividade from '@/components/dashboard/ItemAtividade.vue'
import CabecalhoPagina from '@/components/global/CabecalhoPagina.vue'
import CampoBusca from '@/components/global/CampoBusca.vue'
import CartaoSecao from '@/components/global/CartaoSecao.vue'
import EstadoErro from '@/components/global/EstadoErro.vue'
import EstadoVazio from '@/components/global/EstadoVazio.vue'
import FichaContador from '@/components/global/FichaContador.vue'
import IconeSvg from '@/components/global/IconeSvg.vue'
import ItemMensagem from '@/components/messages/ItemMensagem.vue'
import ItemNoticia from '@/components/news/ItemNoticia.vue'
import CartaoProjeto from '@/components/projects/CartaoProjeto.vue'
import LinhaTarefa from '@/components/tasks/LinhaTarefa.vue'
import CartaoEquipe from '@/components/teams/CartaoEquipe.vue'
import { useDashboard } from '@/composables/useDashboard'
import { useMoverTarefa } from '@/composables/useMoverTarefa'
import { useAuthStore } from '@/stores/auth'
import { dataCabecalho, dataCurta, isoDia, saudacao } from '@/utils/datas'
import type { Usuario } from '@/utils/tipos'

const auth = useAuthStore()
const router = useRouter()
const {
  carregar,
  tentarDeNovo,
  carregando,
  erro,
  abertas,
  abertasAlta,
  emRevisao,
  caderno,
  meusProjetos,
  naoLidas,
  naoLidasEmTarefas,
  mensagensRecentes,
  atividades,
  minhasEquipes,
  noticias,
  dias,
  semana,
  usuario,
  nomeProjeto,
  tituloTarefa,
} = useDashboard()
const { movendo, erroMover, destinos, mover } = useMoverTarefa()

onMounted(carregar)

const busca = ref('')
const rotulo = computed(() => `< MINHA MESA /> · ${dataCabecalho()} · ${meusProjetos.value.length} PROJETOS`)
const periodoSemana = computed(() => `${semana.inicio.getDate()} – ${dataCurta(isoDia(semana.fim))}`)

/** Enter na busca abre o quadro já filtrado. */
function buscar() {
  const termo = busca.value.trim()
  router.push({ name: 'tarefas', query: termo ? { busca: termo } : {} })
}

function membrosDa(ids: number[]): Usuario[] {
  return ids.map((id) => usuario(id)).filter((u): u is Usuario => !!u)
}
</script>

<template>
  <EsqueletoDashboard v-if="carregando" />

  <div v-else class="mesa">
    <CabecalhoPagina class="surgir" :rotulo="rotulo" :titulo="`${saudacao()}, `" :destaque="auth.usuario?.nome ?? ''">
      <template #acoes>
        <CampoBusca v-model="busca" class="busca" placeholder="Buscar..." label="Buscar tarefas" @keydown.enter="buscar" />
        <RouterLink :to="{ name: 'mensagens' }" class="sino" :aria-label="`Notificações: ${naoLidas.length} não lidas`">
          <IconeSvg nome="sino" :tamanho="18" />
          <span v-if="naoLidas.length" class="ponto" aria-hidden="true" />
        </RouterLink>
      </template>
    </CabecalhoPagina>

    <EstadoErro v-if="erro" :mensagem="erro" @tentar-de-novo="tentarDeNovo" />

    <template v-else>
      <p v-if="erroMover" class="erro-mover" role="alert">{{ erroMover }}</p>

      <section class="fichas" aria-label="Resumo">
        <FichaContador
          class="surgir"
          style="--ordem: 1"
          :numero="abertas.length"
          label="[01] Minhas tarefas"
          :descricao="`abertas · ${abertasAlta} com prioridade alta`"
        />
        <FichaContador class="surgir" style="--ordem: 2" :numero="emRevisao" label="[02] Em revisão" descricao="aguardando o líder" />
        <FichaContador class="surgir" style="--ordem: 3" :numero="meusProjetos.length" label="[03] Projetos" descricao="em que você participa" />
        <FichaContador
          class="surgir"
          style="--ordem: 4"
          :numero="naoLidas.length"
          label="[04] Mensagens"
          :descricao="`não lidas · ${naoLidasEmTarefas} em tarefas`"
          destaque
        />
      </section>

      <div class="colunas">
        <div class="principal">
          <CartaoSecao
            class="surgir"
            style="--ordem: 5"
            variante="caderno"
            rotulo="[05] CADERNO"
            titulo="Minhas tarefas"
            :link="{ para: { name: 'tarefas' }, texto: 'Ver todas →' }"
          >
            <TransitionGroup v-if="caderno.length" tag="ul" name="lista" class="lista">
              <LinhaTarefa
                v-for="tarefa in caderno"
                :key="tarefa.id"
                :tarefa="tarefa"
                :nome-projeto="nomeProjeto(tarefa.idProjeto)"
                :destinos="destinos(tarefa)"
                :movendo="movendo === tarefa.id"
                @mover="mover(tarefa, $event)"
              />
            </TransitionGroup>
            <EstadoVazio
              v-else
              compacto
              titulo="Nenhuma tarefa aberta."
              texto="Quando o líder te passar uma tarefa, ela aparece aqui."
            />
          </CartaoSecao>

          <CartaoSecao
            class="surgir"
            style="--ordem: 6"
            variante="aberto"
            rotulo="[06] ARQUIVO"
            titulo="Meus projetos"
            :link="{ para: { name: 'projetos' }, texto: 'Ver todos →' }"
          >
            <div v-if="meusProjetos.length" class="grade-projetos">
              <CartaoProjeto v-for="item in meusProjetos" :key="item.projeto.id" :projeto="item.projeto">
                <p class="funcao">Você: {{ item.funcao }}</p>
                <template #rodape>
                  <span>{{ item.projeto.membros.length }} membros</span>
                  <span class="realce">
                    {{ item.minhasAbertas }} {{ item.minhasAbertas === 1 ? 'sua tarefa' : 'suas tarefas' }}
                  </span>
                </template>
              </CartaoProjeto>
            </div>
            <EstadoVazio v-else compacto titulo="Você ainda não está em nenhum projeto." />
          </CartaoSecao>

          <CartaoSecao rotulo="[07] AGENDA" titulo="Esta semana" :detalhe="periodoSemana" class="agenda surgir" style="--ordem: 7">
            <AgendaSemana :dias="dias" :nome-projeto="nomeProjeto" />
          </CartaoSecao>
        </div>

        <div class="lateral">
          <CartaoSecao
            class="surgir"
            style="--ordem: 5"
            rotulo="[08] BANDEJA DE ENTRADA"
            titulo="Mensagens"
            :link="{ para: { name: 'mensagens' }, texto: 'Abrir caixa →' }"
          >
            <ul v-if="mensagensRecentes.length" class="lista pilha">
              <ItemMensagem
                v-for="mensagem in mensagensRecentes"
                :key="mensagem.id"
                :mensagem="mensagem"
                :remetente="usuario(mensagem.idRemetente)"
                :contexto="tituloTarefa(mensagem.idTarefa) || nomeProjeto(mensagem.idProjeto)"
              />
            </ul>
            <EstadoVazio v-else compacto titulo="Caixa vazia." />
          </CartaoSecao>

          <CartaoSecao class="surgir" style="--ordem: 6" variante="recibo" rotulo="[09] RECIBO" titulo="Atividade recente">
            <ul v-if="atividades.length" class="lista">
              <ItemAtividade
                v-for="atividade in atividades"
                :key="atividade.id"
                :atividade="atividade"
                :nome-autor="usuario(atividade.idAutor)?.nome ?? 'Alguém'"
              />
            </ul>
            <EstadoVazio v-else compacto titulo="Nada novo por aqui." />
          </CartaoSecao>

          <CartaoSecao
            class="surgir"
            style="--ordem: 7"
            variante="mural"
            rotulo="[10] MURAL"
            titulo="Minhas equipes"
            :link="{ para: { name: 'equipes' }, texto: 'Ver →' }"
          >
            <div v-if="minhasEquipes.length" class="grade-equipes">
              <CartaoEquipe
                v-for="equipe in minhasEquipes.slice(0, 2)"
                :key="equipe.id"
                :equipe="equipe"
                :membros="membrosDa(equipe.idsMembros)"
              />
            </div>
            <EstadoVazio v-else compacto titulo="Você ainda não está em nenhuma equipe." />
          </CartaoSecao>

          <CartaoSecao class="surgir" style="--ordem: 8" rotulo="[11] JORNAL" titulo="Notícias" :link="{ para: { name: 'noticias' }, texto: 'Todos →' }">
            <ul v-if="noticias.length" class="lista">
              <ItemNoticia v-for="noticia in noticias" :key="noticia.id" :noticia="noticia" />
            </ul>
            <EstadoVazio v-else compacto titulo="Nenhuma notícia ainda." />
          </CartaoSecao>
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped>
.mesa {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.busca {
  width: min(240px, 100%);
}

.sino {
  position: relative;
  display: grid;
  place-items: center;
  width: 44px;
  height: 44px;
  border: 1px solid var(--border);
  border-radius: var(--radius-btn);
  background: var(--surface);
  color: var(--text-muted);
}

.sino:hover {
  color: var(--text);
}

.ponto {
  position: absolute;
  top: 10px;
  right: 11px;
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--brand-orange);
}

.erro-mover {
  padding: 10px 14px;
  border: 1px solid rgba(255, 32, 32, .35);
  border-radius: var(--radius-btn);
  font-size: 13px;
  color: var(--brand-red);
}

.fichas {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.colunas {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 320px);
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

.lista {
  margin: 0;
  padding: 0;
  list-style: none;
}

.pilha {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.grade-projetos {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.grade-equipes {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 14px;
}

.agenda :deep(.corpo) {
  padding: 0;
}

@media (max-width: 1099px) {
  .colunas {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>
