import { computed, ref } from 'vue'
import { estadoDasFontes } from '@/composables/useLista'
import { useUsuarios } from '@/composables/useUsuarios'
import { useProjetosStore } from '@/stores/projetos'
import { papelPrincipal, papeisDoUsuario } from '@/utils/permissoes'
import { nomeCurso, papelComunidade } from '@/utils/pessoas'

export type FiltroStatusMembro = 'ativos' | 'inativos' | 'todos'

/** Quem faz a Fábrica: filtros de status, curso e área, mais busca por nome ou @usuário. */
export function useListaMembros(gestao = false) {
  const projetos = useProjetosStore()
  const usuariosFonte = useUsuarios()
  const { carregando, erro } = estadoDasFontes([usuariosFonte])

  const inicial = gestao ? 'todos' : 'ativos'
  const status = ref<FiltroStatusMembro>(inicial)
  const papelGestao = ref('')
  const curso = ref('')
  const area = ref('')
  const busca = ref('')

  const itens = computed(() =>
    usuariosFonte.usuarios.value.map((usuario) => ({
      usuario,
      papel: papelComunidade(usuario, projetos.lista),
      papelGestao: { admin: 'Admin', lider: 'Líder', membro: 'Membro' }[papelPrincipal(papeisDoUsuario(usuario, projetos.lista))],
    })),
  )

  const cursos = computed(() => [...new Set(itens.value.map((i) => nomeCurso(i.usuario.curso)))].sort())
  const areas = computed(() => [...new Set(itens.value.map((i) => i.usuario.funcao))].sort())

  const filtrados = computed(() => {
    const termo = busca.value.trim().toLowerCase().replace(/^@/, '')
    return itens.value.filter(
      ({ usuario, papelGestao: papel }) =>
        (!papelGestao.value || papel === papelGestao.value) &&
        (status.value === 'todos' || usuario.ativo === (status.value === 'ativos')) &&
        (!curso.value || nomeCurso(usuario.curso) === curso.value) &&
        (!area.value || usuario.funcao === area.value) &&
        (!termo || `${usuario.nome} ${usuario.nomeCompleto} ${usuario.usuario} ${gestao ? [papel, usuario.funcao, ...(usuario.tags ?? [])].join(' ') : ''}`.toLowerCase().includes(termo)),
    )
  })

  const temFiltro = computed(() => status.value !== inicial || !!papelGestao.value || !!(curso.value || area.value || busca.value.trim()))

  function limparFiltros() {
    status.value = inicial
    papelGestao.value = ''
    curso.value = ''
    area.value = ''
    busca.value = ''
  }

  return {
    carregar: usuariosFonte.carregar,
    carregando,
    erro,
    status,
    papelGestao,
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
