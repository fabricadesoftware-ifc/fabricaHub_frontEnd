import { computed, ref } from 'vue'
import { mensagensApi } from '@/api/mensagens'
import { useEquipes } from '@/composables/useEquipes'
import { estadoDasFontes, useLista } from '@/composables/useLista'
import { useMensagens } from '@/composables/useMensagens'
import { useTarefas } from '@/composables/useTarefas'
import { useUsuarios } from '@/composables/useUsuarios'
import { useAuthStore } from '@/stores/auth'
import { useProjetosStore } from '@/stores/projetos'
import type { Conversa, Mensagem, TipoConversa } from '@/utils/tipos'

export type FiltroConversas = 'todas' | 'naoLidas' | 'projetos' | 'equipes'

/** Como a conversa aparece na lista e no cabeçalho. */
export interface ItemConversa {
  conversa: Conversa
  nome: string
  subtitulo: string
  avatar: { iniciais: string; cor: string; forma: 'quadrado' | 'circulo'; foto: string | null }
  ultima: Mensagem | undefined
  /** "Daniel: Tem uma, só adiciona…" */
  previa: string
  naoLidas: number
  tarefa?: { id: number; titulo: string }
}

const ROTULO_TIPO: Record<TipoConversa, string> = { direta: 'Direta', equipe: 'Equipe', projeto: 'Projeto' }

/** Caixa de entrada: lista de conversas com filtros e busca, conversa aberta, envio e nova mensagem. */
export function useCaixaMensagens() {
  const auth = useAuthStore()
  const projetos = useProjetosStore()
  const idUsuario = computed(() => auth.usuario?.id ?? -1)

  const conversasFonte = useLista(() => mensagensApi.listarConversas(idUsuario.value), 'Não foi possível carregar as conversas.')
  const mensagensFonte = useMensagens()
  const usuariosFonte = useUsuarios()
  const equipesFonte = useEquipes()
  const tarefasFonte = useTarefas()
  const { carregando, erro } = estadoDasFontes([conversasFonte, mensagensFonte, usuariosFonte, equipesFonte])

  const filtro = ref<FiltroConversas>('todas')
  const busca = ref('')
  const idAberta = ref<number | null>(null)
  const enviando = ref(false)
  const erroEnvio = ref('')

  async function carregar() {
    await Promise.all([
      conversasFonte.carregar(),
      mensagensFonte.carregar(true),
      usuariosFonte.carregar(),
      equipesFonte.carregar(),
      tarefasFonte.carregar(),
    ])
  }

  function nomeProjeto(id?: number) {
    return projetos.lista.find((p) => p.id === id)?.nome ?? ''
  }

  function montar(conversa: Conversa): ItemConversa {
    const doFio = mensagensFonte.mensagens.value.filter((m) => m.idConversa === conversa.id)
    const ultima = doFio.at(-1)
    const naoLidas = doFio.filter((m) => !m.lida && m.idRemetente !== idUsuario.value).length
    const autor = ultima && (ultima.idRemetente === idUsuario.value ? 'Você' : usuariosFonte.usuario(ultima.idRemetente)?.nome)
    const tarefaAlvo = tarefasFonte.tarefas.value.find((t) => t.id === conversa.idTarefa)
    const base = {
      conversa,
      ultima,
      naoLidas,
      previa: ultima ? `${autor ?? 'Alguém'}: ${ultima.texto}` : 'Nenhuma mensagem ainda',
      tarefa: tarefaAlvo ? { id: tarefaAlvo.id, titulo: tarefaAlvo.titulo } : undefined,
    }

    if (conversa.tipo === 'direta') {
      const outra = usuariosFonte.usuario(conversa.participantes.find((id) => id !== idUsuario.value) ?? -1)
      return {
        ...base,
        nome: outra?.nome ?? 'Pessoa',
        subtitulo: [outra?.funcao, nomeProjeto(conversa.idProjeto)].filter(Boolean).join(' · '),
        avatar: { iniciais: outra?.iniciais ?? '?', cor: outra?.cor ?? '#5E636B', forma: 'circulo', foto: outra?.foto ?? null },
      }
    }
    if (conversa.tipo === 'equipe') {
      const equipe = equipesFonte.equipes.value.find((e) => e.id === conversa.idAlvo)
      return {
        ...base,
        nome: equipe?.nome ?? 'Equipe',
        subtitulo: `Equipe · ${equipe?.idsMembros.length ?? 0} membros`,
        avatar: { iniciais: (equipe?.nome ?? 'EQ').slice(0, 2), cor: equipe?.cor ?? '#5E636B', forma: 'quadrado', foto: null },
      }
    }
    const projeto = projetos.lista.find((p) => p.id === conversa.idAlvo)
    return {
      ...base,
      nome: projeto?.nome ?? 'Projeto',
      subtitulo: `Projeto · ${projeto ? projeto.membros.length : 0} membros`,
      avatar: { iniciais: projeto?.sigla ?? 'P', cor: projeto?.cor ?? '#5E636B', forma: 'quadrado', foto: null },
    }
  }

  /** Mais recente primeiro. */
  const itens = computed(() =>
    conversasFonte.dados.value
      .map(montar)
      .sort((a, b) => (b.ultima?.em ?? '').localeCompare(a.ultima?.em ?? '')),
  )

  const filtrados = computed(() => {
    const termo = busca.value.trim().toLowerCase()
    return itens.value.filter(
      (item) =>
        (filtro.value === 'todas' ||
          (filtro.value === 'naoLidas' && item.naoLidas > 0) ||
          (filtro.value === 'projetos' && item.conversa.tipo === 'projeto') ||
          (filtro.value === 'equipes' && item.conversa.tipo === 'equipe')) &&
        (!termo || `${item.nome} ${item.previa}`.toLowerCase().includes(termo)),
    )
  })

  const totalNaoLidas = computed(() => itens.value.reduce((soma, i) => soma + (i.naoLidas ? 1 : 0), 0))
  const temFiltro = computed(() => filtro.value !== 'todas' || !!busca.value.trim())
  const aberta = computed(() => itens.value.find((i) => i.conversa.id === idAberta.value) ?? null)
  const fio = computed(() => mensagensFonte.mensagens.value.filter((m) => m.idConversa === idAberta.value))

  function limparFiltros() {
    filtro.value = 'todas'
    busca.value = ''
  }

  async function abrir(idConversa: number) {
    idAberta.value = idConversa
    erroEnvio.value = ''
    mensagensFonte.marcarLidasLocal(idConversa, idUsuario.value)
    try {
      await mensagensApi.marcarLidas(idConversa, idUsuario.value)
    } catch {
      // Sem conexão: a conversa continua aberta; o servidor marca na próxima vez.
    }
  }

  function fechar() {
    idAberta.value = null
  }

  /** Devolve `true` se enviou (o campo pode ser limpo). */
  async function enviar(texto: string, idConversa = idAberta.value): Promise<boolean> {
    const limpo = texto.trim()
    if (!limpo || idConversa === null || enviando.value) return false
    enviando.value = true
    erroEnvio.value = ''
    try {
      mensagensFonte.adicionar(await mensagensApi.enviar(idConversa, idUsuario.value, limpo))
      return true
    } catch {
      erroEnvio.value = 'Não foi possível enviar. O texto continua no campo; tente de novo.'
      return false
    } finally {
      enviando.value = false
    }
  }

  /** Nova mensagem: abre (ou cria) a conversa com o destinatário e manda o texto. */
  async function novaMensagem(tipo: TipoConversa, idAlvo: number, texto: string): Promise<boolean> {
    try {
      const conversa = await mensagensApi.abrirConversa(tipo, idAlvo, idUsuario.value)
      if (!conversasFonte.dados.value.some((c) => c.id === conversa.id)) {
        conversasFonte.dados.value = [...conversasFonte.dados.value, conversa]
      }
      const enviou = await enviar(texto, conversa.id)
      if (enviou) await abrir(conversa.id)
      return enviou
    } catch {
      erroEnvio.value = 'Não foi possível criar a conversa. Tente de novo.'
      return false
    }
  }

  /** Conversa direta já existente com a pessoa (para o atalho "Enviar mensagem" do perfil). */
  function conversaDiretaCom(idPessoa: number) {
    return conversasFonte.dados.value.find((c) => c.tipo === 'direta' && c.participantes.includes(idPessoa))
  }

  /** Destinatários possíveis da nova mensagem. */
  const destinatarios = computed(() => ({
    direta: usuariosFonte.usuarios.value
      .filter((u) => u.id !== idUsuario.value && u.ativo)
      .map((u) => ({ valor: String(u.id), rotulo: u.nomeCompleto })),
    equipe: equipesFonte.equipes.value.map((e) => ({ valor: String(e.id), rotulo: e.nome })),
    projeto: projetos.lista.map((p) => ({ valor: String(p.id), rotulo: p.nome })),
  }))

  return {
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
    usuario: usuariosFonte.usuario,
    ROTULO_TIPO,
  }
}
