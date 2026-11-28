import { computed, watch } from 'vue'
import { agendaApi } from '@/api/agenda'
import { comunidadeApi } from '@/api/comunidade'
import { useLista } from '@/composables/useLista'
import { useMensagens } from '@/composables/useMensagens'
import { useNoticias } from '@/composables/useNoticias'
import { useTarefas } from '@/composables/useTarefas'
import { useUsuarios } from '@/composables/useUsuarios'
import { useAuthStore } from '@/stores/auth'
import { useProjetosStore } from '@/stores/projetos'
import { adicionarDias, isoDia, segundaDaSemana, siglaDia } from '@/utils/datas'
import { ordenarTarefas } from '@/utils/tarefas'
import type { EventoAgenda } from '@/utils/tipos'

/** Dados da "mesa" do membro: fichas, caderno, projetos, agenda, mensagens, atividade, equipes e notícias. */
export function useDashboard() {
  const auth = useAuthStore()
  const projetosStore = useProjetosStore()

  const segunda = segundaDaSemana()
  const sexta = adicionarDias(segunda, 4)
  const idUsuario = computed(() => auth.usuario?.id ?? -1)

  const tarefasFonte = useTarefas()
  const mensagensFonte = useMensagens()
  const noticiasFonte = useNoticias()
  const usuariosFonte = useUsuarios()
  const agendaFonte = useLista(
    () => agendaApi.listar(idUsuario.value, isoDia(segunda), isoDia(sexta)),
    'Não foi possível carregar a agenda.',
  )
  const atividadesFonte = useLista(() => comunidadeApi.listarAtividades(), 'Não foi possível carregar a atividade.')
  const equipesFonte = useLista(() => comunidadeApi.listarEquipes(), 'Não foi possível carregar as equipes.')

  const fontes = [tarefasFonte, mensagensFonte, noticiasFonte, usuariosFonte, agendaFonte, atividadesFonte, equipesFonte]

  async function carregar() {
    await Promise.all([
      tarefasFonte.carregar(),
      mensagensFonte.carregar(),
      noticiasFonte.carregar(),
      usuariosFonte.carregar(),
      agendaFonte.carregar(),
      atividadesFonte.carregar(),
      equipesFonte.carregar(),
    ])
  }

  async function tentarDeNovo() {
    await Promise.all([tarefasFonte.carregar(true), ...fontes.slice(1).map((f) => f.carregar())])
  }

  // Trocou de conta (seletor de papel): a agenda depende do usuário.
  watch(idUsuario, (novo, antigo) => {
    if (antigo !== undefined && novo !== -1) agendaFonte.carregar()
  })

  const carregando = computed(() => fontes.some((f) => f.carregando.value))
  const erro = computed(() => fontes.map((f) => f.erro.value).find(Boolean) ?? null)

  // Tarefas
  const minhas = computed(() => tarefasFonte.tarefas.value.filter((t) => t.idResponsavel === idUsuario.value))
  const abertas = computed(() => minhas.value.filter((t) => t.status !== 'Concluída'))
  const abertasAlta = computed(() => abertas.value.filter((t) => t.prioridade === 'Alta').length)
  const emRevisao = computed(() => minhas.value.filter((t) => t.status === 'Em revisão').length)
  const caderno = computed(() => [...abertas.value].sort(ordenarTarefas).slice(0, 4))
  /** Líder: entregas "Em revisão" nos projetos que ele lidera. */
  const paraRevisar = computed(
    () =>
      tarefasFonte.tarefas.value.filter(
        (t) => t.status === 'Em revisão' && projetosStore.lista.some((p) => p.id === t.idProjeto && p.idLead === idUsuario.value),
      ).length,
  )

  // Projetos em que participa (líder ou membro)
  const meusProjetos = computed(() =>
    projetosStore.lista
      .filter((p) => p.idLead === idUsuario.value || p.membros.some((m) => m.idUsuario === idUsuario.value))
      .map((p) => ({
        projeto: p,
        funcao: p.membros.find((m) => m.idUsuario === idUsuario.value)?.funcao ?? 'Líder',
        minhasAbertas: abertas.value.filter((t) => t.idProjeto === p.id).length,
      })),
  )

  // Mensagens
  // Caixa de entrada: só o que outras pessoas mandaram.
  const recebidas = computed(() => mensagensFonte.mensagens.value.filter((m) => m.idRemetente !== idUsuario.value))
  const naoLidas = computed(() => recebidas.value.filter((m) => !m.lida))
  const naoLidasEmTarefas = computed(() => naoLidas.value.filter((m) => m.idTarefa !== undefined).length)
  const mensagensRecentes = computed(() => recebidas.value.slice(0, 3))
  const atividades = computed(() => atividadesFonte.dados.value.filter((a) => a.idAutor !== idUsuario.value))

  // Equipes e notícias
  const minhasEquipes = computed(() => equipesFonte.dados.value.filter((e) => e.idsMembros.includes(idUsuario.value)))
  const noticias = computed(() => noticiasFonte.noticias.value.slice(0, 2))

  // Agenda: segunda a sexta desta semana
  const hojeIso = isoDia(new Date())
  const dias = computed(() =>
    Array.from({ length: 5 }, (_, i) => {
      const data = adicionarDias(segunda, i)
      const iso = isoDia(data)
      return {
        iso,
        sigla: siglaDia(data),
        numero: data.getDate(),
        hoje: iso === hojeIso,
        eventos: agendaFonte.dados.value.filter((e: EventoAgenda) => e.data === iso),
      }
    }),
  )

  function nomeProjeto(id?: number) {
    return id === undefined ? '' : (projetosStore.lista.find((p) => p.id === id)?.nome ?? '')
  }

  function tituloTarefa(id?: number) {
    return id === undefined ? '' : (tarefasFonte.tarefas.value.find((t) => t.id === id)?.titulo ?? '')
  }

  return {
    carregar,
    tentarDeNovo,
    carregando,
    erro,
    abertas,
    abertasAlta,
    emRevisao,
    paraRevisar,
    caderno,
    meusProjetos,
    naoLidas,
    naoLidasEmTarefas,
    mensagensRecentes,
    atividades,
    minhasEquipes,
    noticias,
    dias,
    semana: { inicio: segunda, fim: sexta },
    usuario: usuariosFonte.usuario,
    nomeProjeto,
    tituloTarefa,
  }
}
