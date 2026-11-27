import { computed, type Ref } from 'vue'
import { comunidadeApi } from '@/api/comunidade'
import { usuariosApi } from '@/api/usuarios'
import { useEquipes } from '@/composables/useEquipes'
import { estadoDasFontes, useDado, useLista } from '@/composables/useLista'
import { useProjetosStore } from '@/stores/projetos'
import { papelComunidade } from '@/utils/pessoas'

/** Perfil de um membro: crachá, projetos, equipes (com período), desempenho e atividade no GitHub. */
export function useMembroDetalhe(id: Ref<number>) {
  const projetosStore = useProjetosStore()
  // Usuário inexistente vira `null` (tela de "não encontrado"), não erro.
  const usuarioFonte = useDado(
    () => usuariosApi.obterPorId(id.value).catch(() => null),
    'Não foi possível carregar o membro.',
  )
  const desempenhoFonte = useDado(() => usuariosApi.obterDesempenho(id.value), 'Não foi possível carregar o desempenho.')
  const githubFonte = useDado(() => usuariosApi.obterAtividadeGithub(id.value), 'Não foi possível carregar o GitHub.')
  const historicoFonte = useLista(
    () => comunidadeApi.listarTimeMembros({ idUsuario: id.value }),
    'Não foi possível carregar as equipes.',
  )
  const equipesFonte = useEquipes()
  const { carregando, erro } = estadoDasFontes([usuarioFonte, desempenhoFonte, githubFonte, historicoFonte, equipesFonte])

  async function carregar() {
    await Promise.all([
      usuarioFonte.carregar(),
      desempenhoFonte.carregar(),
      githubFonte.carregar(),
      historicoFonte.carregar(),
      equipesFonte.carregar(),
    ])
  }

  const usuario = usuarioFonte.dado
  const naoEncontrado = computed(() => !carregando.value && !erro.value && !usuario.value)
  const papel = computed(() => (usuario.value ? papelComunidade(usuario.value, projetosStore.lista) : 'membro'))

  const projetos = computed(() => {
    const u = usuario.value
    if (!u) return []
    return projetosStore.lista.flatMap((projeto) => {
      const funcao = projeto.membros.find((m) => m.idUsuario === u.id)?.funcao
      const lider = projeto.idLead === u.id
      if (!lider && !funcao) return []
      return [{ projeto, funcao: [lider ? 'Líder' : '', funcao ?? ''].filter(Boolean).join(' · ') }]
    })
  })

  const quantidadeLiderados = computed(() => projetos.value.filter((p) => p.projeto.idLead === usuario.value?.id).length)

  /** Equipes atuais primeiro. */
  const equipes = computed(() =>
    historicoFonte.dados.value
      .flatMap((t) => {
        const equipe = equipesFonte.equipes.value.find((e) => e.id === t.idEquipe)
        return equipe ? [{ id: t.id, equipe, inicio: t.inicio, fim: t.fim }] : []
      })
      .sort((a, b) => Number(!!a.fim) - Number(!!b.fim) || b.inicio.localeCompare(a.inicio)),
  )

  return {
    carregar,
    carregando,
    erro,
    naoEncontrado,
    usuario,
    papel,
    projetos,
    quantidadeLiderados,
    equipes,
    desempenho: desempenhoFonte.dado,
    github: githubFonte.dado,
  }
}
