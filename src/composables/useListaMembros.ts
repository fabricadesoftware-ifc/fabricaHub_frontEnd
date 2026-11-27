import { computed, ref } from 'vue'
import { estadoDasFontes } from '@/composables/useLista'
import { useUsuarios } from '@/composables/useUsuarios'
import { useProjetosStore } from '@/stores/projetos'
import { nomeCurso, papelComunidade } from '@/utils/pessoas'

export type FiltroStatusMembro = 'ativos' | 'inativos' | 'todos'

/** Quem faz a Fábrica: filtros de status, curso e área, mais busca por nome ou @usuário. */
export function useListaMembros() {
  const projetos = useProjetosStore()
  const usuariosFonte = useUsuarios()
  const { carregando, erro } = estadoDasFontes([usuariosFonte])

  const status = ref<FiltroStatusMembro>('ativos')
  const curso = ref('')
  const area = ref('')
  const busca = ref('')

  const itens = computed(() =>
    usuariosFonte.usuarios.value.map((usuario) => ({ usuario, papel: papelComunidade(usuario, projetos.lista) })),
  )

  const cursos = computed(() => [...new Set(itens.value.map((i) => nomeCurso(i.usuario.curso)))].sort())
  const areas = computed(() => [...new Set(itens.value.map((i) => i.usuario.funcao))].sort())

  const filtrados = computed(() => {
    const termo = busca.value.trim().toLowerCase().replace(/^@/, '')
    return itens.value.filter(
      ({ usuario }) =>
        (status.value === 'todos' || usuario.ativo === (status.value === 'ativos')) &&
        (!curso.value || nomeCurso(usuario.curso) === curso.value) &&
        (!area.value || usuario.funcao === area.value) &&
        (!termo || `${usuario.nome} ${usuario.nomeCompleto} ${usuario.usuario}`.toLowerCase().includes(termo)),
    )
  })

  const temFiltro = computed(() => status.value !== 'ativos' || !!(curso.value || area.value || busca.value.trim()))

  function limparFiltros() {
    status.value = 'ativos'
    curso.value = ''
    area.value = ''
    busca.value = ''
  }

  return {
    carregar: usuariosFonte.carregar,
    carregando,
    erro,
    status,
    curso,
    area,
    busca,
    cursos,
    areas,
    total: computed(() => itens.value.length),
    filtrados,
    temFiltro,
    limparFiltros,
  }
}
