<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AbasPasta from '@/components/global/AbasPasta.vue'
import AvatarPessoa from '@/components/global/AvatarPessoa.vue'
import BotaoBase from '@/components/global/BotaoBase.vue'
import CabecalhoPagina from '@/components/global/CabecalhoPagina.vue'
import Carimbo from '@/components/global/Carimbo.vue'
import EsqueletoBloco from '@/components/global/EsqueletoBloco.vue'
import EstadoErro from '@/components/global/EstadoErro.vue'
import EstadoVazio from '@/components/global/EstadoVazio.vue'
import IconeSvg from '@/components/global/IconeSvg.vue'
import PilulaStatus from '@/components/global/PilulaStatus.vue'
import RotuloSecao from '@/components/global/RotuloSecao.vue'
import TrilhaNavegacao from '@/components/global/TrilhaNavegacao.vue'
import ItemMensagem from '@/components/messages/ItemMensagem.vue'
import { useProjetoDetalhe } from '@/composables/useProjetoDetalhe'
import { useRole } from '@/composables/useRole'
import { useAuthStore } from '@/stores/auth'
import { corStatusTarefa } from '@/utils/cores'
import { tempoRelativo } from '@/utils/datas'
import { logoFabrica } from '@/utils/logo'
import type { StatusTarefa, Usuario } from '@/utils/tipos'

type Aba = 'visao' | 'tarefas' | 'mensagens'
const ABAS: Aba[] = ['visao', 'tarefas', 'mensagens']

const rota = useRoute()
const router = useRouter()
const auth = useAuthStore()
const { leadsProject } = useRole()
const id = computed(() => Number(rota.params.id))

const {
  carregar,
  carregando,
  erro,
  naoEncontrado,
  projeto,
  lider,
  orientador,
  minhaFuncao,
  equipes,
  pessoas,
  tarefas,
  porStatus,
  percentual,
  recentes,
  mensagens,
  galeria,
  usuario,
} = useProjetoDetalhe(id)

onMounted(carregar)

/** Ações de líder só aparecem no projeto que o usuário lidera. */
const ehLider = computed(() => leadsProject(id.value))

/** A aba fica na query (?aba=tarefas), então dá para compartilhar o link e voltar. */
const aba = computed<Aba>({
  get: () => {
    const valor = rota.query.aba as Aba
    return ABAS.includes(valor) ? valor : 'visao'
  },
  set: (valor) => router.replace({ query: { ...rota.query, aba: valor === 'visao' ? undefined : valor } }),
})

const abas = computed(() => [
  { valor: 'visao' as const, rotulo: 'Visão geral' },
  { valor: 'tarefas' as const, rotulo: 'Tarefas', contador: tarefas.value.length },
  { valor: 'mensagens' as const, rotulo: 'Mensagens', contador: mensagens.value.length },
])

const rotulo = computed(() => ['< PROJETO />', ...(projeto.value?.tecnologias.slice(0, 2) ?? [])].join(' · ').toUpperCase())

/**
 * Progresso: só as concluídas ganham cor (a do projeto); o resto fica em tons neutros.
 * "A fazer" é o próprio trilho vazio da barra.
 */
const ETAPAS: { status: StatusTarefa; rotulo: string; tom: string }[] = [
  { status: 'Concluída', rotulo: 'Concluídas', tom: 'var(--cor-projeto)' },
  { status: 'Em revisão', rotulo: 'Em revisão', tom: 'rgba(255, 255, 255, .45)' },
  { status: 'Fazendo', rotulo: 'Fazendo', tom: 'rgba(255, 255, 255, .22)' },
  { status: 'A fazer', rotulo: 'A fazer', tom: 'var(--surface-2)' },
]

function largura(status: StatusTarefa) {
  return `${tarefas.value.length ? (porStatus.value[status] / tarefas.value.length) * 100 : 0}%`
}

function mensagemPara(pessoa: Usuario) {
  return { name: 'mensagens', query: { para: pessoa.id } }
}
</script>

<template>
  <div class="pagina">
    <!-- Carregando: formato do cabeçalho, abas e das duas colunas -->
    <template v-if="carregando">
      <div class="carregando-pagina" aria-hidden="true">
        <EsqueletoBloco largura="200px" altura="12px" />
        <div class="esqueleto-topo">
          <EsqueletoBloco largura="60px" altura="60px" raio="12px" />
          <div class="esqueleto-textos">
            <EsqueletoBloco largura="160px" altura="10px" />
            <EsqueletoBloco largura="280px" altura="26px" />
            <EsqueletoBloco largura="320px" altura="12px" />
          </div>
        </div>
        <div class="esqueleto-abas">
          <EsqueletoBloco v-for="i in 3" :key="i" largura="110px" altura="40px" raio="8px 8px 0 0" />
        </div>
        <div class="visao">
          <EsqueletoBloco altura="520px" raio="12px" />
          <EsqueletoBloco altura="420px" raio="12px" />
        </div>
      </div>
      <p class="sr-only" role="status">Carregando o projeto…</p>
    </template>

    <EstadoErro v-else-if="erro" :mensagem="erro" @tentar-de-novo="carregar" />

    <EstadoVazio v-else-if="naoEncontrado || !projeto" titulo="Projeto não encontrado." texto="Ele pode ter sido removido.">
      <BotaoBase variante="secundario" :para="{ name: auth.usuario?.isSuper ? 'admin-projetos' : 'projetos' }">Voltar para Projetos</BotaoBase>
    </EstadoVazio>

    <template v-else>
      <TrilhaNavegacao class="surgir" :itens="[{ texto: 'Projetos', para: { name: auth.usuario?.isSuper ? 'admin-projetos' : 'projetos' } }, { texto: projeto.nome }]" />

      <CabecalhoPagina class="surgir" style="--ordem: 1" :rotulo="rotulo" :titulo="projeto.nome">
        <template #icone>
          <!-- Imagem do projeto: por enquanto, o logo da Fábrica como exemplo -->
          <span class="capa">
            <img v-if="logoFabrica" :src="logoFabrica" :alt="`Imagem do projeto ${projeto.nome}`" />
            <span v-else aria-hidden="true">{{ projeto.sigla }}</span>
          </span>
        </template>
        <template #depois>
          <p class="meta">
            <PilulaStatus :status="projeto.status" />
            <span v-if="lider">Líder: <RouterLink :to="{ name: 'membro', params: { id: lider.id } }">{{ lider.nome }}</RouterLink></span>
            <span v-if="orientador">
              Orientador: <RouterLink :to="{ name: 'membro', params: { id: orientador.id } }">{{ orientador.nome }}</RouterLink>
            </span>
            <span v-if="ehLider" class="voce">Você é o líder</span>
            <span v-else-if="minhaFuncao" class="voce">Você: {{ minhaFuncao }}</span>
          </p>
        </template>
        <template #acoes>
          <BotaoBase v-if="projeto.repositorio" variante="secundario" :href="projeto.repositorio">
            <IconeSvg nome="github" :tamanho="16" /> Repositório
          </BotaoBase>
          <BotaoBase v-if="projeto.figma" variante="secundario" :href="projeto.figma">
            <IconeSvg nome="externo" :tamanho="16" /> Figma
          </BotaoBase>
          <BotaoBase v-if="ehLider || auth.usuario?.isSuper" :para="{ name: auth.usuario?.isSuper ? 'admin-projetos-editar' : 'projeto-editar', params: { id: projeto.id } }">
            <IconeSvg nome="editar" :tamanho="16" /> Editar projeto
          </BotaoBase>
        </template>
      </CabecalhoPagina>

      <AbasPasta id="projeto" v-model="aba" class="surgir" style="--ordem: 2" label="Seções do projeto" :abas="abas">
        <!-- Visão geral -->
        <div v-if="aba === 'visao'" class="visao">
          <div class="coluna">
            <section class="bloco">
              <RotuloSecao rotulo="[01] SOBRE" />
              <p class="descricao">{{ projeto.descricao }}</p>
              <ul class="tecnologias" aria-label="Tecnologias">
                <li v-for="tecnologia in projeto.tecnologias" :key="tecnologia">{{ tecnologia }}</li>
              </ul>
            </section>

            <section class="bloco" :style="{ '--cor-projeto': projeto.cor }">
              <RotuloSecao rotulo="[02] PROGRESSO" />
              <p class="resumo-progresso">
                <strong class="percentual">{{ percentual }}%</strong>
                <span>{{ porStatus['Concluída'] }} de {{ tarefas.length }} tarefas concluídas</span>
              </p>
              <div
                class="barra"
                role="progressbar"
                :aria-valuenow="percentual"
                aria-valuemin="0"
                aria-valuemax="100"
                :aria-label="`${percentual}% das tarefas concluídas`"
              >
                <template v-for="etapa in ETAPAS.slice(0, 3)" :key="etapa.status">
                  <span
                    v-if="porStatus[etapa.status]"
                    class="segmento"
                    :class="{ principal: etapa.status === 'Concluída' }"
                    :style="{ width: largura(etapa.status), background: etapa.tom }"
                  />
                </template>
              </div>
              <dl class="legenda-progresso">
                <div v-for="etapa in ETAPAS" :key="etapa.status">
                  <dt><span class="ponto" :style="{ background: etapa.tom }" aria-hidden="true" />{{ etapa.rotulo }}</dt>
                  <dd>{{ porStatus[etapa.status] }}</dd>
                </div>
              </dl>
            </section>

            <section class="bloco">
              <div class="cabeca">
                <RotuloSecao rotulo="[03] MEXIDAS POR ÚLTIMO" />
                <button type="button" class="link-acao" @click="aba = 'tarefas'">Ver todas as tarefas →</button>
              </div>
              <ul v-if="recentes.length" class="lista">
                <li v-for="{ tarefa, em } in recentes" :key="tarefa.id" class="linha">
                  <div class="linha-textos">
                    <RouterLink :to="{ name: 'tarefa', params: { id: tarefa.id } }" class="linha-nome">{{ tarefa.titulo }}</RouterLink>
                    <span class="linha-mono">{{ usuario(tarefa.idResponsavel)?.nome ?? '—' }} · {{ tempoRelativo(em) }}</span>
                  </div>
                  <span class="status-linha"><span class="ponto" :style="{ background: corStatusTarefa[tarefa.status] }" aria-hidden="true" />{{ tarefa.status }}</span>
                </li>
              </ul>
              <EstadoVazio v-else compacto titulo="Nenhuma tarefa neste projeto." />
            </section>

            <section class="bloco">
              <div class="cabeca">
                <RotuloSecao rotulo="[04] GALERIA" />
                <RouterLink v-if="ehLider" :to="{ name: 'projeto-galeria', params: { id: projeto.id } }" class="link-acao">Gerenciar galeria →</RouterLink>
                <span v-else class="detalhe">{{ galeria.length }} {{ galeria.length === 1 ? 'ARQUIVO' : 'ARQUIVOS' }}</span>
              </div>
              <ul v-if="galeria.length" class="galeria">
                <li v-for="imagem in galeria" :key="imagem.id" class="miniatura">
                  <span class="moldura">
                    <img v-if="imagem.url" :src="imagem.url" :alt="imagem.arquivo" class="enviada" />
                    <img v-else-if="logoFabrica" :src="logoFabrica" alt="" />
                    <IconeSvg v-else nome="arquivos" :tamanho="20" />
                  </span>
                  <span class="legenda">
                    <span class="arquivo">{{ imagem.arquivo }}</span>
                    <span class="tipo">{{ imagem.tipo }}</span>
                  </span>
                </li>
              </ul>
              <EstadoVazio v-else compacto titulo="Nenhuma imagem na galeria." />
            </section>
          </div>

          <!-- Pessoas -->
          <section class="pessoas" aria-labelledby="titulo-pessoas">
            <div class="cabeca">
              <RotuloSecao rotulo="[05] PESSOAS"><span id="titulo-pessoas" class="sr-only">Pessoas do projeto</span></RotuloSecao>
              <RouterLink v-if="ehLider" :to="{ name: 'projeto-membros', params: { id: projeto.id } }" class="link-acao">Gerenciar →</RouterLink>
              <span v-else class="detalhe">{{ pessoas.total }} {{ pessoas.total === 1 ? 'MEMBRO' : 'MEMBROS' }} · {{ equipes.length }} {{ equipes.length === 1 ? 'EQUIPE' : 'EQUIPES' }}</span>
            </div>

            <div v-for="grupo in pessoas.grupos" :key="grupo.id" class="grupo">
              <h3 class="grupo-titulo">
                <span class="grupo-cor" :style="{ background: grupo.cor }" aria-hidden="true" />
                {{ grupo.nome }}
                <span class="grupo-total">{{ grupo.pessoas.length }}</span>
              </h3>
              <ul class="lista-pessoas">
                <li v-for="{ usuario: pessoa, lider: ehLider } in grupo.pessoas" :key="pessoa.id" class="pessoa">
                  <AvatarPessoa :nome="pessoa.nome" :iniciais="pessoa.iniciais" :cor="pessoa.cor" :foto="pessoa.foto" :tamanho="30" forma="circulo" />
                  <RouterLink :to="{ name: 'membro', params: { id: pessoa.id } }" class="pessoa-nome">{{ pessoa.nome }}</RouterLink>
                  <Carimbo v-if="ehLider" texto="Líder" tipo="devolvido" tamanho="pequeno" class="carimbo" />
                  <RouterLink
                    v-if="pessoa.id !== auth.usuario?.id"
                    :to="mensagemPara(pessoa)"
                    class="botao-mensagem"
                    :aria-label="`Mandar mensagem para ${pessoa.nome}`"
                  >
                    <IconeSvg nome="mensagens" :tamanho="15" />
                  </RouterLink>
                </li>
              </ul>
            </div>
            <EstadoVazio v-if="!pessoas.grupos.length" compacto titulo="Ninguém no projeto ainda." />

            <div v-if="orientador" class="orientador">
              <AvatarPessoa :nome="orientador.nome" :iniciais="orientador.iniciais" :cor="orientador.cor" :foto="orientador.foto" :tamanho="30" forma="circulo" />
              <div class="orientador-textos">
                <span class="orientador-rotulo">ORIENTADOR</span>
                <RouterLink :to="{ name: 'membro', params: { id: orientador.id } }" class="pessoa-nome">{{ orientador.nome }}</RouterLink>
              </div>
              <RouterLink
                v-if="orientador.id !== auth.usuario?.id"
                :to="mensagemPara(orientador)"
                class="botao-mensagem"
                :aria-label="`Mandar mensagem para ${orientador.nome}`"
              >
                <IconeSvg nome="mensagens" :tamanho="15" />
              </RouterLink>
            </div>
          </section>
        </div>

        <!-- Tarefas (só leitura) -->
        <template v-else-if="aba === 'tarefas'">
          <div class="aviso-tarefas">
            <p v-if="ehLider">
              <IconeSvg nome="info" :tamanho="14" />
              Para mover, criar ou revisar tarefas, use o quadro do projeto.
            </p>
            <p v-else>
              <IconeSvg nome="info" :tamanho="14" />
              Aqui você só consulta. Para mover as suas tarefas, use o quadro.
            </p>
            <BotaoBase v-if="ehLider" variante="secundario" :para="{ name: 'projeto-tarefas', params: { id: projeto.id } }">
              Quadro do projeto →
            </BotaoBase>
            <BotaoBase v-else variante="secundario" :para="{ name: 'tarefas' }">Minhas tarefas →</BotaoBase>
          </div>
          <ul v-if="tarefas.length" class="lista">
            <li v-for="tarefa in tarefas" :key="tarefa.id" class="linha">
              <div class="linha-textos">
                <RouterLink :to="{ name: 'tarefa', params: { id: tarefa.id } }" class="linha-nome">{{ tarefa.titulo }}</RouterLink>
                <span class="linha-mono">{{ usuario(tarefa.idResponsavel)?.nome ?? '—' }} · {{ tarefa.branch }}</span>
              </div>
              <span class="status-linha"><span class="ponto" :style="{ background: corStatusTarefa[tarefa.status] }" aria-hidden="true" />{{ tarefa.status }}</span>
            </li>
          </ul>
          <EstadoVazio v-else compacto titulo="Nenhuma tarefa neste projeto." />
        </template>

        <!-- Mensagens -->
        <template v-else>
          <ul v-if="mensagens.length" class="lista pilha">
            <ItemMensagem
              v-for="mensagem in mensagens"
              :key="mensagem.id"
              :mensagem="mensagem"
              :remetente="usuario(mensagem.idRemetente)"
              :contexto="projeto.nome"
            />
          </ul>
          <EstadoVazio v-else compacto titulo="Nenhuma mensagem neste projeto." />
        </template>
      </AbasPasta>
    </template>
  </div>
</template>

<style scoped>
.pagina {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* Capa do projeto (logo de exemplo) */
.capa {
  display: grid;
  place-items: center;
  width: 64px;
  height: 64px;
  overflow: hidden;
  border-radius: var(--radius-menu);
  background: var(--text);
  box-shadow: var(--shadow-hard);
  font-size: 26px;
  font-weight: 700;
  color: var(--ink);
}

.capa img {
  width: 78%;
  height: 78%;
  object-fit: contain;
}

.meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 4px 16px;
  font-size: 12.5px;
  color: var(--text-muted);
}

.meta a {
  font-weight: 600;
  color: var(--text);
  text-decoration: none;
}

.meta a:hover {
  text-decoration: underline;
}

.voce {
  font-weight: 600;
  color: var(--accent);
}

/* Visão geral: duas colunas */
.visao {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 320px);
  align-items: start;
  gap: 24px;
}

.coluna {
  display: flex;
  flex-direction: column;
  gap: 28px;
  min-width: 0;
}

.bloco {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.cabeca {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.detalhe {
  font-family: var(--font-mono);
  font-size: 10.5px;
  font-weight: 700;
  letter-spacing: .1em;
  color: var(--text-subtle);
}

.descricao {
  max-width: 70ch;
  font-size: 14px;
  line-height: 1.6;
}

.tecnologias {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.tecnologias li {
  padding: 4px 12px;
  border: 1px solid rgba(255, 255, 255, .12);
  border-radius: var(--radius-pill);
  font-family: var(--font-mono);
  font-size: 10.5px;
  font-weight: 700;
  text-transform: uppercase;
}

/* Progresso: o momento da tela */
.resumo-progresso {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 4px 12px;
  font-size: 13px;
  color: var(--text-muted);
}

.percentual {
  font-family: var(--font-mono);
  font-size: 32px;
  font-weight: 600;
  line-height: 1.1;
  font-variant-numeric: tabular-nums;
  color: var(--text);
}

.barra {
  display: flex;
  gap: 2px;
  height: 12px;
  overflow: hidden;
  border-radius: 4px;
  background: var(--surface-2);
}

.segmento {
  height: 100%;
}

/* Só a barra das concluídas cresce, uma vez, ao abrir */
.segmento.principal {
  transform-origin: left;
  animation: encher var(--dur-lenta) var(--ease-saida) backwards;
}

@keyframes encher {
  from {
    transform: scaleX(0);
  }
}

.legenda-progresso {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 24px;
  margin: 0;
}

.legenda-progresso div {
  display: flex;
  align-items: center;
  gap: 8px;
}

.legenda-progresso dt {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: var(--text-muted);
}

.legenda-progresso dd {
  margin: 0;
  font-family: var(--font-mono);
  font-size: 13px;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
}

.ponto {
  flex-shrink: 0;
  width: 8px;
  height: 8px;
  border-radius: 2px;
}

.legenda-progresso .ponto {
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, .12);
}

.status-linha {
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: var(--text-muted);
}

.status-linha .ponto {
  border-radius: 50%;
}

.link-acao {
  display: inline-flex;
  align-items: center;
  min-height: 32px;
  text-decoration: none;
  padding: 0;
  border: 0;
  background: transparent;
  font-size: 12px;
  font-weight: 600;
  color: var(--accent);
  cursor: pointer;
}

.link-acao:hover {
  text-decoration: underline;
}

/* Listas */
.lista {
  display: flex;
  flex-direction: column;
  margin: 0;
  padding: 0;
  list-style: none;
}

.lista > li + li {
  border-top: 1px solid var(--border);
}

.pilha {
  gap: 8px;
}

.pilha > li + li {
  border-top: 0;
}

.linha {
  display: flex;
  align-items: center;
  gap: 12px;
  min-height: 56px;
  padding: 8px 0;
}

.linha-textos {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.linha-nome {
  font-size: 13.5px;
  font-weight: 600;
  color: var(--text);
  text-decoration: none;
}

.linha-nome:hover {
  text-decoration: underline;
}

.linha-mono {
  overflow: hidden;
  font-family: var(--font-mono);
  font-size: 11px;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: var(--text-subtle);
}

/* Galeria em faixa */
.galeria {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 12px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.miniatura {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border-radius: var(--radius-btn);
  background: var(--surface-2);
}

.moldura {
  display: grid;
  place-items: center;
  aspect-ratio: 16 / 10;
  background: var(--ink);
  border-bottom: 1px solid var(--border);
  color: var(--text-subtle);
}

.moldura img {
  width: 40%;
  height: 40%;
  object-fit: contain;
  opacity: .85;
}

.moldura img.enviada {
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 1;
}

.legenda {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 8px 12px;
}

.arquivo {
  overflow: hidden;
  font-family: var(--font-mono);
  font-size: 11px;
  font-weight: 700;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.tipo {
  flex-shrink: 0;
  font-family: var(--font-mono);
  font-size: 9px;
  font-weight: 700;
  letter-spacing: .1em;
  color: var(--text-subtle);
}

/* Pessoas */
.pessoas {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 20px;
  border: 1px solid var(--border);
  border-radius: var(--radius-menu);
  background: var(--surface-2);
}

.grupo {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.grupo-titulo {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  font-weight: 700;
}

.grupo-cor {
  width: 8px;
  height: 8px;
  border-radius: 2px;
}

.grupo-total {
  margin-left: auto;
  font-family: var(--font-mono);
  font-size: 10.5px;
  color: var(--text-subtle);
}

.lista-pessoas {
  margin: 0;
  padding: 0;
  list-style: none;
}

.pessoa,
.orientador {
  display: flex;
  align-items: center;
  gap: 10px;
  min-height: 44px;
}

.pessoa :deep(.circulo),
.orientador :deep(.circulo) {
  border-color: var(--surface-2);
}

.pessoa-nome {
  flex: 1;
  min-width: 0;
  font-size: 13px;
  font-weight: 600;
  color: var(--text);
  text-decoration: none;
}

.pessoa-nome:hover {
  text-decoration: underline;
}

.carimbo {
  flex-shrink: 0;
  animation: none;
}

.botao-mensagem {
  flex-shrink: 0;
  display: grid;
  place-items: center;
  width: 36px;
  height: 36px;
  margin-right: -8px;
  border-radius: var(--radius-btn);
  color: var(--text-subtle);
  transition: color var(--dur-media), background-color var(--dur-media);
}

.botao-mensagem:hover {
  background: rgba(255, 255, 255, .06);
  color: var(--text);
}

.orientador {
  padding-top: 12px;
  border-top: 1px dashed rgba(255, 255, 255, .12);
}

.orientador-textos {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.orientador-rotulo {
  font-family: var(--font-mono);
  font-size: 9px;
  font-weight: 700;
  letter-spacing: .14em;
  color: var(--text-subtle);
}

/* Tarefas */
.aviso-tarefas {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 8px;
  padding: 12px;
  border-radius: var(--radius-btn);
  background: var(--surface-2);
}

.aviso-tarefas p {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12.5px;
  color: var(--text-muted);
}

/* Skeleton */
.carregando-pagina {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.carregando-pagina :deep(.esqueleto) {
  max-width: 100%;
}

.esqueleto-topo {
  display: flex;
  align-items: center;
  gap: 16px;
}

.esqueleto-textos {
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 0;
  max-width: 100%;
}

.esqueleto-abas {
  display: flex;
  gap: 4px;
  overflow: hidden;
}

@media (max-width: 899px) {
  .visao {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>
