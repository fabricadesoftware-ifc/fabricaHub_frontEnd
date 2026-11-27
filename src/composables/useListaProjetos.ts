import { computed, ref } from 'vue'
import { estadoDasFontes } from '@/composables/useLista'
import { useProjetos } from '@/composables/useProjetos'
import { useUsuarios } from '@/composables/useUsuarios'
import { useAuthStore } from '@/stores/auth'
import type { StatusProjeto } from '@/utils/tipos'

export const STATUS_PROJETO: StatusProjeto[] = ['Em andamento', 'Planejamento', 'Pausado', 'Concluído']

/** Arquivo de projetos: filtros de status, tecnologia, "Só os meus" e busca (todos combináveis). */
export function useListaProjetos() {
  const auth = useAuthStore()
  const projetosFonte = useProjetos()
  const usuariosFonte = useUsuarios()
  const { carregando, erro } = estadoDasFontes([projetosFonte, usuariosFonte])

  const status = ref<StatusProjeto | null>(null)
  const tecnologia = ref('')
  const soMeus = ref(false)
  const busca = ref('')

  const idUsuario = computed(() => auth.usuario?.id ?? -1)

  async function carregar() {
    await Promise.all([projetosFonte.carregar(), usuariosFonte.carregar()])
  }

  const tecnologias = computed(() =>
    [...new Set(projetosFonte.projetos.value.flatMap((p) => p.tecnologias))].sort((a, b) => a.localeCompare(b, 'pt-BR')),
  )

  const itens = computed(() =>
    projetosFonte.projetos.value.map((projeto) => ({
      projeto,
      lider: usuariosFonte.usuario(projeto.idLead)?.nome ?? '—',
      /** Função do usuário logado no projeto (vazio = não participa). */
      minhaFuncao:
        projeto.idLead === idUsuario.value
          ? 'Líder'
          : (projeto.membros.find((m) => m.idUsuario === idUsuario.value)?.funcao ?? ''),
    })),
  )

  const filtrados = computed(() => {
    const termo = busca.value.trim().toLowerCase()
    return itens.value.filter(
      ({ projeto, minhaFuncao }) =>
        (!status.value || projeto.status === status.value) &&
        (!tecnologia.value || projeto.tecnologias.includes(tecnologia.value)) &&
        (!soMeus.value || minhaFuncao) &&
        (!termo || `${projeto.nome} ${projeto.resumo}`.toLowerCase().includes(termo)),
    )
  })

  const temFiltro = computed(() => !!(status.value || tecnologia.value || soMeus.value || busca.value.trim()))

  function limparFiltros() {
    status.value = null
    tecnologia.value = ''
    soMeus.value = false
    busca.value = ''
  }

  return {
    carregar,
    carregando,
    erro,
    status,
    tecnologia,
    soMeus,
    busca,
    tecnologias,
    total: computed(() => itens.value.length),
    filtrados,
    temFiltro,
    limparFiltros,
  }
}
