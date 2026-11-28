<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import BotaoBase from '@/components/global/BotaoBase.vue'
import CartaoSecao from '@/components/global/CartaoSecao.vue'
import EsqueletoBloco from '@/components/global/EsqueletoBloco.vue'
import EstadoErro from '@/components/global/EstadoErro.vue'
import EstadoVazio from '@/components/global/EstadoVazio.vue'
import EtiquetaEquipe from '@/components/global/EtiquetaEquipe.vue'
import IconeSvg, { type NomeIcone } from '@/components/global/IconeSvg.vue'
import PilulaStatus from '@/components/global/PilulaStatus.vue'
import RotuloSecao from '@/components/global/RotuloSecao.vue'
import TrilhaNavegacao from '@/components/global/TrilhaNavegacao.vue'
import CrachaMembro from '@/components/members/CrachaMembro.vue'
import CartaoProjeto from '@/components/projects/CartaoProjeto.vue'
import { useMembroDetalhe } from '@/composables/useMembroDetalhe'
import { useAuthStore } from '@/stores/auth'
import { diaMes, diasAte, mesAno, periodo } from '@/utils/datas'
import { NOME_PAPEL } from '@/utils/pessoas'
import type { TipoLink } from '@/utils/tipos'

const rota = useRoute()
const auth = useAuthStore()
const id = computed(() => Number(rota.params.id))
const { carregar, carregando, erro, naoEncontrado, usuario, papel, projetos, quantidadeLiderados, equipes, desempenho, github } =
  useMembroDetalhe(id)

onMounted(carregar)

const ehVoce = computed(() => usuario.value?.id === auth.usuario?.id)

const ICONE_LINK: Record<TipoLink, NomeIcone> = { GitHub: 'github', LinkedIn: 'linkedin', Site: 'globo' }

const registro = computed(() => {
  const u = usuario.value
  if (!u) return ''
  const n = quantidadeLiderados.value
  const papelTexto = papel.value === 'lider' ? `LÍDER EM ${n} ${n === 1 ? 'PROJETO' : 'PROJETOS'}` : NOME_PAPEL[papel.value]
  return `${papelTexto} · Nº ${String(u.registro).padStart(3, '0')}`
})

const maxCommits = computed(() => Math.max(1, ...(github.value?.commitsPorMes.map((m) => m.total) ?? [])))

const quandoUltima = computed(() => {
  if (!github.value) return ''
  const dias = -diasAte(github.value.ultimaAtividade)
  if (dias <= 0) return 'hoje'
  if (dias === 1) return 'ontem'
  return `há ${dias} dias`
})

const doisDigitos = (n: number) => String(n).padStart(2, '0')
</script>

<template>
  <div class="pagina">
    <template v-if="carregando">
      <div class="carregando-pagina" aria-hidden="true">
        <EsqueletoBloco largura="140px" altura="12px" />
        <div class="colunas">
          <div class="lateral">
            <EsqueletoBloco altura="360px" raio="12px" />
            <EsqueletoBloco altura="160px" raio="12px" />
          </div>
          <div class="principal">
            <EsqueletoBloco altura="96px" raio="12px" />
            <div class="desempenho">
              <EsqueletoBloco v-for="i in 4" :key="i" altura="96px" raio="8px" />
            </div>
            <EsqueletoBloco altura="380px" raio="12px" />
          </div>
        </div>
      </div>
      <p class="sr-only" role="status">Carregando o perfil…</p>
    </template>

    <EstadoErro v-else-if="erro" :mensagem="erro" @tentar-de-novo="carregar" />

    <EstadoVazio v-else-if="naoEncontrado || !usuario" titulo="Membro não encontrado." texto="Confira o link ou volte para a lista.">
      <BotaoBase variante="secundario" :para="{ name: auth.usuario?.isSuper ? 'admin-membros' : 'membros' }">Voltar para Membros</BotaoBase>
    </EstadoVazio>

    <template v-else>
      <TrilhaNavegacao class="surgir" :itens="[{ texto: 'Membros', para: { name: auth.usuario?.isSuper ? 'admin-membros' : 'membros' } }, { texto: usuario.nome }]" />

      <div class="colunas">
        <!-- Coluna do crachá -->
        <div class="lateral">
          <CrachaMembro
            class="surgir"
            style="--ordem: 1"
            tamanho="grande"
            nivel="h1"
            :nome="usuario.nomeCompleto"
            :usuario="usuario.usuario"
            :curso="usuario.curso"
            :papel="papel"
            :cor="usuario.cor"
            :iniciais="usuario.iniciais"
            :foto="usuario.foto"
            :online="usuario.online"
          >
            <p class="vinculo">{{ usuario.vinculo }} na Fábrica desde {{ mesAno(usuario.desde).toLowerCase() }}</p>
            <ul v-if="usuario.links.length" class="links">
              <li v-for="link in usuario.links" :key="link.url">
                <a :href="link.url" target="_blank" rel="noopener noreferrer" class="link-icone" :aria-label="`${link.tipo} de ${usuario.nome}`">
                  <IconeSvg :nome="ICONE_LINK[link.tipo]" :tamanho="16" />
                </a>
              </li>
            </ul>
            <BotaoBase v-if="auth.usuario?.isSuper" :para="{ name: 'admin-membros-editar', params: { id } }">Editar cadastro</BotaoBase>
            <BotaoBase v-if="ehVoce" variante="secundario" bloco class="botao-cracha" :para="{ name: 'perfil' }">Editar meu perfil</BotaoBase>
            <BotaoBase v-else bloco class="botao-cracha" :para="{ name: 'mensagens', query: { para: usuario.id } }">
              Enviar mensagem
            </BotaoBase>
            <template #rodape>
              <span class="registro">{{ registro }}</span>
            </template>
          </CrachaMembro>

          <section class="surgir bloco" style="--ordem: 2" aria-labelledby="titulo-projetos">
            <RotuloSecao rotulo="[01] ARQUIVO">
              <span id="titulo-projetos">Projetos</span>
            </RotuloSecao>
            <div v-if="projetos.length" class="pastas">
              <CartaoProjeto
                v-for="item in projetos"
                :key="item.projeto.id"
                :projeto="item.projeto"
                pardo
                :mostrar-status="false"
                :limite-tecnologias="0"
              >
                <template #rodape>
                  <span>{{ item.funcao }}</span>
                  <PilulaStatus :status="item.projeto.status" />
                </template>
              </CartaoProjeto>
            </div>
            <EstadoVazio v-else compacto titulo="Ainda não participa de projetos." />
          </section>

          <CartaoSecao class="surgir" style="--ordem: 3" rotulo="[02] EQUIPES">
            <ul v-if="equipes.length" class="lista">
              <li v-for="item in equipes" :key="item.id">
                <EtiquetaEquipe
                  :nome="item.equipe.nome"
                  :cor="item.equipe.cor"
                  :para="{ name: 'equipe', params: { id: item.equipe.id } }"
                  :detalhe="periodo(item.inicio, item.fim)"
                />
              </li>
            </ul>
            <EstadoVazio v-else compacto titulo="Ainda não está em nenhuma equipe." />
          </CartaoSecao>
        </div>

        <!-- Coluna principal -->
        <div class="principal">
          <CartaoSecao class="surgir" style="--ordem: 2" rotulo="[03] SOBRE">
            <p class="bio">{{ usuario.bio || 'Ainda não escreveu uma biografia.' }}</p>
          </CartaoSecao>

          <section v-if="desempenho" class="surgir bloco" style="--ordem: 3" aria-labelledby="titulo-desempenho">
            <RotuloSecao rotulo="[04] DESEMPENHO">
              <span id="titulo-desempenho">No FabricaHUB</span>
            </RotuloSecao>
            <ul class="desempenho">
              <li class="numero">
                <span class="numero-rotulo">Concluídas</span>
                <strong class="numero-valor verde">{{ doisDigitos(desempenho.concluidas) }}</strong>
                <span class="numero-texto">tarefas aprovadas</span>
              </li>
              <li class="numero">
                <span class="numero-rotulo">Em andamento</span>
                <strong class="numero-valor">{{ doisDigitos(desempenho.fazendo + desempenho.emRevisao) }}</strong>
                <span class="numero-texto">{{ desempenho.fazendo }} fazendo · {{ desempenho.emRevisao }} em revisão</span>
              </li>
              <li class="numero">
                <span class="numero-rotulo">De primeira</span>
                <strong class="numero-valor">{{ desempenho.dePrimeira }}%</strong>
                <span class="numero-texto">aprovadas sem devolução</span>
              </li>
              <li class="numero">
                <span class="numero-rotulo">Devolvidas</span>
                <strong class="numero-valor laranja">{{ doisDigitos(desempenho.devolvidas) }}</strong>
                <span class="numero-texto">voltaram para ajuste</span>
              </li>
            </ul>
          </section>

          <section v-if="github" class="cartao-github surgir" style="--ordem: 4" aria-labelledby="titulo-github">
            <h2 id="titulo-github" class="titulo-github">
              <IconeSvg nome="github" :tamanho="18" />
              Atividade no GitHub
            </h2>

            <dl class="totais">
              <div>
                <dt>commits na organização</dt>
                <dd class="destaque">{{ github.commits }}</dd>
              </div>
              <div>
                <dt>pull requests</dt>
                <dd>{{ github.pullRequests }}</dd>
              </div>
              <div>
                <dt>última atividade ({{ quandoUltima }})</dt>
                <dd>{{ diaMes(github.ultimaAtividade) }}</dd>
              </div>
            </dl>

            <div class="grafico-bloco">
              <p class="subtitulo" id="titulo-commits">Commits por mês</p>
              <ol class="grafico" aria-labelledby="titulo-commits">
                <li
                  v-for="(mes, i) in github.commitsPorMes"
                  :key="mes.mes"
                  class="coluna"
                  :class="{ atual: i === github.commitsPorMes.length - 1 }"
                >
                  <span class="valor">{{ mes.total }}<span class="sr-only"> commits</span></span>
                  <span class="barra" :style="{ height: `${(mes.total / maxCommits) * 100}%` }" aria-hidden="true" />
                  <span class="mes">{{ mes.mes }}</span>
                </li>
              </ol>
            </div>

            <div>
              <p class="subtitulo">Pull requests recentes</p>
              <ul class="prs">
                <li v-for="pr in github.prsRecentes" :key="`${pr.repositorio}-${pr.numero}`" class="pr">
                  <span class="pr-repo">{{ pr.repositorio }} <span class="pr-numero">#{{ pr.numero }}</span></span>
                  <span class="pr-titulo">{{ pr.titulo }}</span>
                  <span class="pr-data">{{ diaMes(pr.data) }}/{{ pr.data.slice(0, 4) }}</span>
                </li>
              </ul>
            </div>

            <p class="nota">Dados públicos do GitHub, contados na organização fabricadesoftware-ifc.</p>
          </section>
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped>
.pagina {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.colunas {
  display: grid;
  grid-template-columns: minmax(0, 340px) minmax(0, 1fr);
  align-items: start;
  gap: 24px;
}

.lateral,
.principal {
  display: flex;
  flex-direction: column;
  gap: 20px;
  min-width: 0;
}

.bloco {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

/* Crachá */
.vinculo {
  margin-top: 4px;
  font-size: 13px;
  color: var(--text-muted);
}

.links {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin: 10px 0 4px;
  padding: 0;
  list-style: none;
}

.link-icone {
  position: relative;
  z-index: 3;
  display: grid;
  place-items: center;
  width: 44px;
  height: 44px;
  border: 1px solid rgba(255, 255, 255, .12);
  border-radius: var(--radius-btn);
  color: var(--text-muted);
  transition: color var(--dur-media), border-color var(--dur-media);
}

.link-icone:hover {
  border-color: rgba(255, 255, 255, .24);
  color: var(--text);
}

.botao-cracha {
  margin-top: 8px;
}

.registro {
  color: var(--cor-papel-claro);
}

.pastas {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.lista {
  margin: 0;
  padding: 0;
  list-style: none;
}

.bio {
  font-size: 15px;
  line-height: 1.6;
}

/* Desempenho */
.desempenho {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(170px, 1fr));
  gap: 14px;
  margin: 8px 0 0;
  padding: 0;
  list-style: none;
}

.numero {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 16px 18px;
  border: 1px solid var(--border);
  border-radius: var(--radius-btn);
  background: var(--surface);
  box-shadow: var(--shadow-hard);
}

.numero-rotulo {
  font-family: var(--font-mono);
  font-size: 10.5px;
  font-weight: 700;
  letter-spacing: .12em;
  text-transform: uppercase;
  color: var(--text-subtle);
}

.numero-valor {
  font-family: var(--font-mono);
  font-size: 32px;
  font-weight: 800;
  line-height: 1.2;
}

.verde {
  color: var(--online);
}

.laranja {
  color: var(--accent);
}

.numero-texto {
  font-size: 13px;
  color: var(--text-muted);
}

/* GitHub */
.cartao-github {
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 22px 24px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-menu);
  box-shadow: var(--shadow-hard);
}

.titulo-github {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 18px;
  font-weight: 600;
}

.totais {
  display: flex;
  flex-wrap: wrap;
  gap: 16px 48px;
  margin: 0;
}

.totais div {
  display: flex;
  flex-direction: column-reverse;
}

.totais dt {
  font-size: 13px;
  color: var(--text-muted);
}

.totais dd {
  margin: 0;
  font-family: var(--font-mono);
  font-size: 34px;
  font-weight: 800;
  line-height: 1.2;
}

.totais .destaque {
  color: var(--status-fazendo);
}

.subtitulo {
  margin-bottom: 10px;
  font-family: var(--font-mono);
  font-size: 10px;
  font-weight: 700;
  letter-spacing: .14em;
  text-transform: uppercase;
  color: var(--text-subtle);
}

.grafico {
  display: grid;
  grid-template-columns: repeat(6, minmax(0, 1fr));
  align-items: end;
  gap: 12px;
  height: 200px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.coluna {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  gap: 4px;
  height: 100%;
}

.valor {
  font-family: var(--font-mono);
  font-size: 11.5px;
  color: var(--text-subtle);
}

.barra {
  width: 100%;
  min-height: 4px;
  border-radius: 4px 4px 0 0;
  background: var(--surface-2);
  transform-origin: bottom;
  animation: crescer var(--dur-lenta) var(--ease-saida) backwards;
}

.atual .barra {
  background: var(--status-fazendo);
}

.atual .valor {
  font-weight: 700;
  color: var(--text);
}

.mes {
  font-family: var(--font-mono);
  font-size: 11.5px;
  color: var(--text-subtle);
}

.atual .mes {
  font-weight: 700;
  color: var(--text);
}

@keyframes crescer {
  from {
    transform: scaleY(0);
  }
}

.prs {
  margin: 0;
  padding: 0;
  list-style: none;
}

.pr {
  display: grid;
  grid-template-columns: minmax(0, 260px) minmax(0, 1fr) auto;
  align-items: center;
  gap: 16px;
  min-height: 48px;
  border-top: 1px solid var(--border);
  font-size: 14px;
}

.pr-repo {
  overflow: hidden;
  font-family: var(--font-mono);
  font-size: 12px;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: var(--text-subtle);
}

.pr-numero {
  font-weight: 700;
  color: var(--status-fazendo);
}

.pr-titulo {
  font-weight: 600;
}

.pr-data {
  font-family: var(--font-mono);
  font-size: 12px;
  color: var(--text-subtle);
}

.nota {
  font-size: 11.5px;
  color: var(--text-subtle);
}

.carregando-pagina {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

@media (max-width: 899px) {
  .colunas {
    grid-template-columns: minmax(0, 1fr);
  }
}

@media (max-width: 599px) {
  .pr {
    grid-template-columns: minmax(0, 1fr) auto;
    padding: 6px 0;
  }

  .pr-repo {
    grid-column: 1 / -1;
  }
}
</style>
