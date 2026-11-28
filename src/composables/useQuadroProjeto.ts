import { computed, ref, type Ref } from 'vue'
import { estadoDasFontes } from '@/composables/useLista'
import { useTarefas } from '@/composables/useTarefas'
import { useUsuarios } from '@/composables/useUsuarios'
import { useAuthStore } from '@/stores/auth'
import { useProjetosStore } from '@/stores/projetos'
import { ordenarTarefas } from '@/utils/tarefas'
import type { StatusTarefa, Usuario } from '@/utils/tipos'

export const COLUNAS_PROJETO: { status: StatusTarefa; titulo: string }[] = [
  { status: 'A fazer', titulo: 'A FAZER' },
  { status: 'Fazendo', titulo: 'FAZENDO' },
  { status: 'Em revisão', titulo: 'EM REVISÃO' },
  { status: 'Concluída', titulo: 'CONCLUÍDA' },
]

/** Quadro de produção do líder: todas as tarefas do projeto, com filtro por responsável e busca. */
export function useQuadroProjeto(idProjeto: Ref<number>) {
  const auth = useAuthStore()
  const projetosStore = useProjetosStore()
  const tarefasFonte = useTarefas()
  const usuariosFonte = useUsuarios()
  const { carregando, erro } = estadoDasFontes([tarefasFonte, usuariosFonte])

  /** null = todos */
  const responsavel = ref<number | null>(null)
  const busca = ref('')

  async function carregar() {
    await Promise.all([tarefasFonte.carregar(true), usuariosFonte.carregar()])
  }

  const projeto = computed(() => projetosStore.lista.find((p) => p.id === idProjeto.value) ?? null)
  const projetosLiderados = computed(() => projetosStore.lista.filter((p) => p.idLead === auth.usuario?.id))
  const doProjeto = computed(() => tarefasFonte.tarefas.value.filter((t) => t.idProjeto === idProjeto.value))

  /** Quem tem tarefa no projeto vira filtro (na ordem em que aparece no projeto). */
  const responsaveis = computed(() => {
    const ids = [...new Set(doProjeto.value.map((t) => t.idResponsavel))]
    return ids.map((id) => usuariosFonte.usuario(id)).filter((u): u is Usuario => !!u)
  })

  const filtradas = computed(() => {
    const termo = busca.value.trim().toLowerCase()
    return doProjeto.value.filter(
      (t) =>
        (responsavel.value === null || t.idResponsavel === responsavel.value) &&
        (!termo || `${t.titulo} ${t.branch}`.toLowerCase().includes(termo)),
    )
  })

  const colunas = computed(() =>
    COLUNAS_PROJETO.map((coluna) => ({
      ...coluna,
      tarefas: filtradas.value.filter((t) => t.status === coluna.status).sort(ordenarTarefas),
    })),
  )

  const temFiltro = computed(() => responsavel.value !== null || !!busca.value.trim())

  function limparFiltros() {
    responsavel.value = null
    busca.value = ''
  }

  return {
    carregar,
    carregando,
    erro,
    projeto,
    projetosLiderados,
    responsaveis,
    responsavel,
    busca,
    colunas,
    temTarefas: computed(() => doProjeto.value.length > 0),
    temResultado: computed(() => filtradas.value.length > 0),
    temFiltro,
    limparFiltros,
    usuario: usuariosFonte.usuario,
  }
}
