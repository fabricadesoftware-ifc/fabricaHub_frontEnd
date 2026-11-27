import { computed, ref } from 'vue'
import { useTarefas } from '@/composables/useTarefas'
import { useAuthStore } from '@/stores/auth'
import { useProjetosStore } from '@/stores/projetos'
import { ordenarTarefas } from '@/utils/tarefas'
import type { StatusTarefa } from '@/utils/tipos'

const COLUNAS: { status: StatusTarefa; titulo: string }[] = [
  { status: 'A fazer', titulo: '01 · A FAZER' },
  { status: 'Fazendo', titulo: '02 · FAZENDO' },
  { status: 'Em revisão', titulo: '03 · EM REVISÃO' },
  { status: 'Concluída', titulo: '04 · CONCLUÍDAS' },
]

/** Quadro "Minhas tarefas": filtro por projeto, busca por título/branch e as 4 colunas. */
export function useQuadroTarefas() {
  const auth = useAuthStore()
  const projetosStore = useProjetosStore()
  const { tarefas, carregando, erro, carregar } = useTarefas()

  const filtroProjeto = ref<number | null>(null)
  const busca = ref('')

  const minhas = computed(() => tarefas.value.filter((t) => t.idResponsavel === auth.usuario?.id))

  /** Só os projetos onde o usuário tem tarefa viram filtro. */
  const projetosDoFiltro = computed(() =>
    projetosStore.lista.filter((p) => minhas.value.some((t) => t.idProjeto === p.id)),
  )

  const filtradas = computed(() => {
    const termo = busca.value.trim().toLowerCase()
    return minhas.value.filter(
      (t) =>
        (filtroProjeto.value === null || t.idProjeto === filtroProjeto.value) &&
        (!termo || t.titulo.toLowerCase().includes(termo) || t.branch.toLowerCase().includes(termo)),
    )
  })

  const colunas = computed(() =>
    COLUNAS.map((coluna) => ({
      ...coluna,
      tarefas: filtradas.value.filter((t) => t.status === coluna.status).sort(ordenarTarefas),
    })),
  )

  return {
    carregando,
    erro,
    /** Busca de novo a cada visita ao quadro (mostra o skeleton e traz o estado atual). */
    carregar: () => carregar(true),
    tentarDeNovo: () => carregar(true),
    filtroProjeto,
    busca,
    projetosDoFiltro,
    temTarefas: computed(() => minhas.value.length > 0),
    colunas,
  }
}
