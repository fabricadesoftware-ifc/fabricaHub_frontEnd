import { computed, ref } from 'vue'
import { discussaoApi } from '@/api/discussao'
import { tarefasApi } from '@/api/tarefas'
import { estadoDasFontes, useDado } from '@/composables/useLista'
import { useTarefas } from '@/composables/useTarefas'
import { useUsuarios } from '@/composables/useUsuarios'
import { useAuthStore } from '@/stores/auth'
import { useProjetosStore } from '@/stores/projetos'
import type { DecisaoRevisao } from '@/utils/tipos'

/** Prancheta de revisão: entregas "Em revisão" dos projetos que o usuário lidera. */
export function useRevisoes() {
  const auth = useAuthStore()
  const projetos = useProjetosStore()
  const tarefasFonte = useTarefas()
  const usuariosFonte = useUsuarios()
  const idUsuario = computed(() => auth.usuario?.id ?? -1)
  const revisadasFonte = useDado(() => discussaoApi.contarRevisoesDeHoje(idUsuario.value), 'Não foi possível contar as revisões.')
  const { carregando, erro } = estadoDasFontes([tarefasFonte, usuariosFonte])

  const idAberta = ref<number | null>(null)
  const comentario = ref('')
  const revisando = ref(false)
  const erroRevisao = ref('')
  /** Carimbo mostrado logo depois da decisão. */
  const ultimaDecisao = ref<{ idTarefa: number; decisao: DecisaoRevisao } | null>(null)

  async function carregar() {
    await Promise.all([tarefasFonte.carregar(true), usuariosFonte.carregar(), revisadasFonte.carregar()])
    if (!pendentes.value.some((p) => p.tarefa.id === idAberta.value)) idAberta.value = pendentes.value[0]?.tarefa.id ?? null
  }

  const liderados = computed(() => projetos.lista.filter((p) => p.idLead === idUsuario.value))

  /** Mais recente primeiro. */
  const pendentes = computed(() =>
    tarefasFonte.tarefas.value
      .filter((t) => t.status === 'Em revisão' && liderados.value.some((p) => p.id === t.idProjeto))
      .map((tarefa) => ({
        tarefa,
        projeto: liderados.value.find((p) => p.id === tarefa.idProjeto)!,
        responsavel: usuariosFonte.usuario(tarefa.idResponsavel),
      }))
      .sort((a, b) => (b.tarefa.enviadaEm ?? b.tarefa.criadaEm).localeCompare(a.tarefa.enviadaEm ?? a.tarefa.criadaEm)),
  )

  const aberta = computed(() => pendentes.value.find((p) => p.tarefa.id === idAberta.value) ?? null)

  function abrir(id: number) {
    idAberta.value = id
    comentario.value = ''
    erroRevisao.value = ''
    ultimaDecisao.value = null
  }

  /** Devolver exige comentário. Depois da decisão, abre a próxima entrega. */
  async function revisar(decisao: DecisaoRevisao) {
    const atual = aberta.value
    if (!atual || revisando.value) return
    if (decisao === 'devolver' && !comentario.value.trim()) {
      erroRevisao.value = 'Escreva o que precisa mudar antes de devolver.'
      return
    }
    revisando.value = true
    erroRevisao.value = ''
    try {
      const atualizada = await tarefasApi.revisar(atual.tarefa.id, decisao, idUsuario.value, comentario.value)
      ultimaDecisao.value = { idTarefa: atualizada.id, decisao }
      // Deixa o carimbo aparecer antes de a entrega sair da lista.
      await new Promise((resolver) => setTimeout(resolver, 700))
      tarefasFonte.substituir(atualizada)
      revisadasFonte.dado.value = (revisadasFonte.dado.value ?? 0) + 1
      comentario.value = ''
      ultimaDecisao.value = null
      idAberta.value = pendentes.value[0]?.tarefa.id ?? null
    } catch {
      erroRevisao.value = 'Não foi possível registrar a revisão. Tente de novo.'
      ultimaDecisao.value = null
    } finally {
      revisando.value = false
    }
  }

  return {
    carregar,
    carregando,
    erro,
    pendentes,
    aberta,
    abrir,
    comentario,
    revisar,
    revisando,
    erroRevisao,
    ultimaDecisao,
    revisadasHoje: computed(() => revisadasFonte.dado.value ?? 0),
  }
}
