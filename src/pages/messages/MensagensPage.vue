<script setup lang="ts">
import { computed, nextTick, onMounted, ref, useTemplateRef, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AvatarPessoa from '@/components/global/AvatarPessoa.vue'
import BotaoBase from '@/components/global/BotaoBase.vue'
import CabecalhoPagina from '@/components/global/CabecalhoPagina.vue'
import CampoBusca from '@/components/global/CampoBusca.vue'
import EsqueletoBloco from '@/components/global/EsqueletoBloco.vue'
import EstadoErro from '@/components/global/EstadoErro.vue'
import EstadoVazio from '@/components/global/EstadoVazio.vue'
import GrupoPilulas from '@/components/global/GrupoPilulas.vue'
import IconeSvg from '@/components/global/IconeSvg.vue'
import BalaoMensagem from '@/components/messages/BalaoMensagem.vue'
import ItemConversa from '@/components/messages/ItemConversa.vue'
import ModalNovaMensagem from '@/components/messages/ModalNovaMensagem.vue'
import { useCaixaMensagens, type FiltroConversas } from '@/composables/useCaixaMensagens'
import { horaOuData, rotuloDia } from '@/utils/datas'
import type { Mensagem, TipoConversa } from '@/utils/tipos'

const rota = useRoute()
const router = useRouter()
const {
  carregar,
  carregando,
  erro,
  filtro,
  busca,
  filtrados,
  totalNaoLidas,
  temFiltro,
  limparFiltros,
  aberta,
  fio,
  abrir,
  fechar,
  enviar,
  enviando,
  erroEnvio,
  novaMensagem,
  conversaDiretaCom,
  destinatarios,
  idUsuario,
  usuario,
  ROTULO_TIPO,
} = useCaixaMensagens()

const opcoesFiltro: { valor: FiltroConversas; rotulo: string }[] = [
  { valor: 'todas', rotulo: 'Todas' },
  { valor: 'naoLidas', rotulo: 'Não lidas' },
  { valor: 'projetos', rotulo: 'Projetos' },
  { valor: 'equipes', rotulo: 'Equipes' },
]

const resposta = ref('')
const modalAberto = ref(false)
const destinoInicial = ref<{ tipo: TipoConversa; idAlvo: number } | null>(null)
const listaFio = useTemplateRef<HTMLOListElement>('listaFio')

const rotulo = computed(() => `< BANDEJA DE ENTRADA /> · ${totalNaoLidas.value} ${totalNaoLidas.value === 1 ? 'NÃO LIDA' : 'NÃO LIDAS'}`)

/** Mensagens agrupadas por dia (divisórias "HOJE", "ONTEM", "22 NOV"). */
const dias = computed(() => {
  const grupos: { dia: string; mensagens: Mensagem[] }[] = []
  for (const m of fio.value) {
    const dia = rotuloDia(m.em)
    if (grupos.at(-1)?.dia !== dia) grupos.push({ dia, mensagens: [] })
    grupos.at(-1)!.mensagens.push(m)
  }
  return grupos
})

async function abrirConversa(id: number) {
  await abrir(id)
  router.replace({ query: { c: id } })
}

function voltarParaLista() {
  fechar()
  router.replace({ query: {} })
}

async function responder() {
  if (await enviar(resposta.value)) resposta.value = ''
}

async function aoEnviarNova(tipo: TipoConversa, idAlvo: number, texto: string) {
  if (await novaMensagem(tipo, idAlvo, texto)) {
    modalAberto.value = false
    if (aberta.value) router.replace({ query: { c: aberta.value.conversa.id } })
  }
}

function abrirModal(inicial: { tipo: TipoConversa; idAlvo: number } | null = null) {
  destinoInicial.value = inicial
  modalAberto.value = true
}

// Rola para a última mensagem ao abrir a conversa ou chegar mensagem nova.
watch(
  () => [aberta.value?.conversa.id, fio.value.length],
  async () => {
    await nextTick()
    listaFio.value?.scrollTo({ top: listaFio.value.scrollHeight })
  },
)

onMounted(async () => {
  await carregar()
  const idConversa = Number(rota.query.c)
  const idPessoa = Number(rota.query.para)
  if (idConversa) return abrir(idConversa)
  // "Enviar mensagem" no perfil: abre a conversa direta ou o modal já com a pessoa.
  if (idPessoa) {
    const existente = conversaDiretaCom(idPessoa)
    if (existente) return abrirConversa(existente.id)
    return abrirModal({ tipo: 'direta', idAlvo: idPessoa })
  }
  // No desktop a primeira conversa já abre ao lado.
  if (window.matchMedia('(min-width: 900px)').matches && filtrados.value[0]) abrir(filtrados.value[0].conversa.id)
})
</script>

<template>
  <div class="pagina">
    <CabecalhoPagina class="surgir" :rotulo="rotulo" titulo="Mensagens">
      <template #acoes>
        <BotaoBase @click="abrirModal()"><IconeSvg nome="mais" :tamanho="16" /> Nova mensagem</BotaoBase>
      </template>
    </CabecalhoPagina>

    <div v-if="carregando" class="caixa" aria-hidden="true">
      <div class="painel lista-painel">
        <EsqueletoBloco altura="44px" raio="8px" />
        <EsqueletoBloco v-for="i in 5" :key="i" altura="64px" raio="8px" />
      </div>
      <div class="painel conversa-painel carregando-conversa">
        <EsqueletoBloco largura="220px" altura="36px" raio="8px" />
        <EsqueletoBloco largura="60%" altura="56px" raio="12px" />
        <EsqueletoBloco largura="50%" altura="56px" raio="12px" class="direita" />
        <EsqueletoBloco largura="55%" altura="56px" raio="12px" />
      </div>
    </div>
    <p v-if="carregando" class="sr-only" role="status">Carregando mensagens…</p>

    <EstadoErro v-else-if="erro" :mensagem="erro" @tentar-de-novo="carregar" />

    <div v-else class="caixa surgir" style="--ordem: 1" :class="{ 'com-conversa': aberta }">
      <!-- Lista de conversas -->
      <section class="painel lista-painel" aria-label="Conversas">
        <CampoBusca v-model="busca" placeholder="Buscar conversa..." label="Buscar conversa" />
        <GrupoPilulas v-model="filtro" class="filtros" :opcoes="opcoesFiltro" label="Filtrar conversas" />
        <ul v-if="filtrados.length" class="conversas">
          <li v-for="item in filtrados" :key="item.conversa.id">
            <ItemConversa
              :item="item"
              :ativa="aberta?.conversa.id === item.conversa.id"
              :rotulo-tipo="ROTULO_TIPO[item.conversa.tipo]"
              @abrir="abrirConversa(item.conversa.id)"
            />
          </li>
        </ul>
        <EstadoVazio
          v-else
          compacto
          :titulo="temFiltro ? 'Nenhuma conversa encontrada.' : 'Caixa vazia.'"
          :texto="temFiltro ? 'Tente outro filtro ou outra busca.' : 'Comece uma conversa com Nova mensagem.'"
        >
          <BotaoBase v-if="temFiltro" variante="secundario" class="limpar" @click="limparFiltros">Limpar filtros</BotaoBase>
        </EstadoVazio>
      </section>

      <!-- Conversa aberta -->
      <section v-if="aberta" class="painel conversa-painel" :aria-label="`Conversa com ${aberta.nome}`">
        <header class="conversa-topo">
          <button type="button" class="voltar" aria-label="Voltar para as conversas" @click="voltarParaLista">
            <IconeSvg nome="voltar" :tamanho="16" />
          </button>
          <AvatarPessoa
            :nome="aberta.nome"
            :iniciais="aberta.avatar.iniciais"
            :cor="aberta.avatar.cor"
            :foto="aberta.avatar.foto"
            :forma="aberta.avatar.forma"
            :tamanho="36"
          />
          <div class="conversa-textos">
            <h2 class="conversa-nome">{{ aberta.nome }}</h2>
            <p class="conversa-sub">{{ aberta.subtitulo }}</p>
          </div>
          <RouterLink v-if="aberta.tarefa" :to="{ name: 'tarefa', params: { id: aberta.tarefa.id } }" class="atalho-tarefa">
            <IconeSvg nome="tarefas" :tamanho="14" />
            <span>{{ aberta.tarefa.titulo }}</span>
          </RouterLink>
        </header>

        <ol ref="listaFio" class="fio" aria-live="polite">
          <li v-for="grupo in dias" :key="grupo.dia" class="dia">
            <p class="divisoria"><span>{{ grupo.dia }}</span></p>
            <ul class="baloes">
              <BalaoMensagem
                v-for="m in grupo.mensagens"
                :key="m.id"
                :autor="m.idRemetente === idUsuario ? 'Você' : (usuario(m.idRemetente)?.nome ?? 'Alguém')"
                :hora="horaOuData(m.em)"
                :texto="m.texto"
                :minha="m.idRemetente === idUsuario"
              />
            </ul>
          </li>
          <li v-if="!dias.length" class="fio-vazio">Nenhuma mensagem ainda. Escreva a primeira.</li>
        </ol>

        <form class="resposta" @submit.prevent="responder">
          <label class="campo-resposta">
            <span class="sr-only">Resposta para {{ aberta.nome }}</span>
            <textarea v-model="resposta" rows="2" placeholder="Escreva uma resposta..." @keydown.enter.exact.prevent="responder" />
          </label>
          <BotaoBase tipo="submit" :disabled="!resposta.trim() || enviando">{{ enviando ? 'Enviando…' : 'Enviar' }}</BotaoBase>
          <p v-if="erroEnvio && !modalAberto" class="erro-envio" role="alert">{{ erroEnvio }}</p>
        </form>
      </section>

      <section v-else class="painel conversa-painel sem-conversa">
        <EstadoVazio titulo="Escolha uma conversa." texto="Ou comece uma nova com o botão Nova mensagem." />
      </section>
    </div>

    <ModalNovaMensagem
      v-model="modalAberto"
      :destinatarios="destinatarios"
      :inicial="destinoInicial"
      :enviando="enviando"
      :erro="modalAberto ? erroEnvio : ''"
      @enviar="aoEnviarNova"
    />
  </div>
</template>

<style scoped>
.pagina {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.caixa {
  display: grid;
  grid-template-columns: minmax(0, 340px) minmax(0, 1fr);
  gap: 16px;
  height: clamp(480px, calc(100vh - 180px), 760px);
}

.painel {
  display: flex;
  flex-direction: column;
  min-height: 0;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-menu);
  box-shadow: var(--shadow-hard);
}

/* Lista */
.lista-painel {
  gap: 12px;
  padding: 12px;
}

.filtros :deep(.pilula) {
  min-height: 36px;
  padding: 0 12px;
  font-size: 12px;
}

.conversas {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-height: 0;
  margin: 0 -4px;
  padding: 0 4px;
  overflow-y: auto;
  list-style: none;
}

.limpar {
  margin-top: 8px;
}

/* Conversa */
.conversa-painel {
  overflow: hidden;
}

.conversa-topo {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-bottom: 1px solid var(--border);
}

.conversa-topo :deep(.circulo) {
  border-color: transparent;
}

.voltar {
  display: none;
  place-items: center;
  width: 44px;
  height: 44px;
  margin-left: -8px;
  border: 0;
  border-radius: var(--radius-btn);
  background: transparent;
  color: var(--text-muted);
  cursor: pointer;
}

.conversa-textos {
  flex: 1;
  min-width: 0;
}

.conversa-nome {
  font-size: 15px;
  font-weight: 600;
}

.conversa-sub {
  overflow: hidden;
  font-size: 12px;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: var(--text-muted);
}

.atalho-tarefa {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  max-width: 40%;
  min-height: 36px;
  padding: 0 12px;
  border: 1px solid rgba(255, 255, 255, .12);
  border-radius: var(--radius-btn);
  font-size: 12px;
  font-weight: 600;
  color: var(--text);
  text-decoration: none;
  transition: border-color var(--dur-media);
}

.atalho-tarefa span {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.atalho-tarefa:hover {
  border-color: rgba(255, 255, 255, .24);
}

.fio {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;
  min-height: 0;
  margin: 0;
  padding: 16px;
  overflow-y: auto;
  list-style: none;
}

.dia {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.divisoria {
  display: flex;
  align-items: center;
  gap: 12px;
  font-family: var(--font-mono);
  font-size: 10px;
  font-weight: 700;
  letter-spacing: .14em;
  color: var(--text-subtle);
}

.divisoria::before,
.divisoria::after {
  content: '';
  flex: 1;
  height: 1px;
  background: var(--border);
}

.baloes {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.fio-vazio {
  margin: auto;
  font-size: 13px;
  color: var(--text-muted);
}

.resposta {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  gap: 12px;
  padding: 12px 16px 16px;
  border-top: 1px solid var(--border);
}

.campo-resposta {
  flex: 1;
  display: flex;
}

.campo-resposta textarea {
  flex: 1;
  min-height: 48px;
  max-height: 160px;
  padding: 12px;
  border: 1px solid var(--border);
  border-radius: var(--radius-btn);
  background: var(--ink);
  font-size: 13.5px;
  line-height: 1.5;
  resize: vertical;
}

.campo-resposta textarea:focus-visible {
  border-color: var(--accent);
}

.erro-envio {
  flex-basis: 100%;
  font-size: 12.5px;
  color: var(--brand-red);
}

.sem-conversa {
  justify-content: center;
  padding: 24px;
}

.carregando-conversa {
  gap: 16px;
  padding: 16px;
}

.carregando-conversa .direita {
  align-self: flex-end;
}

/* Abaixo de 900px: lista OU conversa, com botão de voltar */
@media (max-width: 899px) {
  .caixa {
    grid-template-columns: minmax(0, 1fr);
    height: auto;
  }

  .lista-painel {
    max-height: none;
  }

  .conversa-painel {
    height: calc(100vh - 140px);
    min-height: 420px;
  }

  .com-conversa .lista-painel,
  .caixa:not(.com-conversa) .conversa-painel {
    display: none;
  }

  .voltar {
    display: grid;
  }

  .atalho-tarefa span {
    display: none;
  }
}
</style>
