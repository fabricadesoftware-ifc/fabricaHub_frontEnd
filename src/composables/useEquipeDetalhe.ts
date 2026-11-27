import { computed, ref, type Ref } from 'vue'
import { comunidadeApi } from '@/api/comunidade'
import { estadoDasFontes, useDado, useLista } from '@/composables/useLista'
import { useUsuarios } from '@/composables/useUsuarios'
import { useAuthStore } from '@/stores/auth'
import { useProjetosStore } from '@/stores/projetos'


/** Ficha da equipe: membros com o período (Time_Membro) e os projetos da equipe. */
export function useEquipeDetalhe(id: Ref<number>) {
  const auth = useAuthStore()
  const projetosStore = useProjetosStore()
  const equipeFonte = useDado(() => comunidadeApi.obterEquipe(id.value), 'Não foi possível carregar a equipe.')
  const historicoFonte = useLista(
    () => comunidadeApi.listarTimeMembros({ idEquipe: id.value }),
    'Não foi possível carregar os membros da equipe.',
  )
  const usuariosFonte = useUsuarios()
  const { carregando, erro } = estadoDasFontes([equipeFonte, historicoFonte, usuariosFonte])

  const mostrarEx = ref(false)

  async function carregar() {
    await Promise.all([equipeFonte.carregar(), historicoFonte.carregar(), usuariosFonte.carregar()])
  }

  const equipe = equipeFonte.dado
  const naoEncontrada = computed(() => !carregando.value && !erro.value && !equipe.value)
  const souMembro = computed(() => !!equipe.value?.idsMembros.includes(auth.usuario?.id ?? -1))

  /** Atuais primeiro (por data de entrada); ex-membros só com "Mostrar ex-membros". */
  const linhas = computed(() =>
    historicoFonte.dados.value
      .filter((t) => mostrarEx.value || !t.fim)
      .flatMap((t) => {
        const usuario = usuariosFonte.usuario(t.idUsuario)
        return usuario ? [{ id: t.id, usuario, inicio: t.inicio, fim: t.fim, atual: !t.fim }] : []
      })
      .sort((a, b) => Number(b.atual) - Number(a.atual) || a.inicio.localeCompare(b.inicio)),
  )

  const quantidadeEx = computed(() => historicoFonte.dados.value.filter((t) => t.fim).length)

  const projetos = computed(() =>
    (equipe.value?.projetos ?? []).flatMap((vinculo) => {
      const projeto = projetosStore.lista.find((p) => p.id === vinculo.idProjeto)
      return projeto ? [{ projeto, vinculo }] : []
    }),
  )

  return { carregar, carregando, erro, naoEncontrada, equipe, souMembro, mostrarEx, linhas, quantidadeEx, projetos }
}

