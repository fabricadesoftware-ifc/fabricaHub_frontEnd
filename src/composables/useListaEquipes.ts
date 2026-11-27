import { computed, ref } from 'vue'
import { useEquipes } from '@/composables/useEquipes'
import { estadoDasFontes } from '@/composables/useLista'
import { useUsuarios } from '@/composables/useUsuarios'
import { useAuthStore } from '@/stores/auth'
import { useProjetosStore } from '@/stores/projetos'
import type { Usuario } from '@/utils/tipos'

export type FiltroEquipes = 'todas' | 'minhas'

/** Quadro de equipes: filtro "Minhas equipes" e busca. */
export function useListaEquipes() {
  const auth = useAuthStore()
  const projetos = useProjetosStore()
  const equipesFonte = useEquipes()
  const usuariosFonte = useUsuarios()
  const { carregando, erro } = estadoDasFontes([equipesFonte, usuariosFonte])

  const filtro = ref<FiltroEquipes>('todas')
  const busca = ref('')
  const idUsuario = computed(() => auth.usuario?.id ?? -1)

  async function carregar() {
    await Promise.all([equipesFonte.carregar(), usuariosFonte.carregar()])
  }

  const itens = computed(() =>
    equipesFonte.equipes.value.map((equipe) => ({
      equipe,
      membros: equipe.idsMembros.map((id) => usuariosFonte.usuario(id)).filter((u): u is Usuario => !!u),
      /** Primeira palavra do nome do projeto ("Painel · FabricaHUB"). */
      projetos: equipe.idsProjetos
        .map((id) => projetos.lista.find((p) => p.id === id)?.nome.split(' ')[0])
        .filter(Boolean)
        .join(' · '),
      souMembro: equipe.idsMembros.includes(idUsuario.value),
    })),
  )

  const filtrados = computed(() => {
    const termo = busca.value.trim().toLowerCase()
    return itens.value.filter(
      (item) =>
        (filtro.value === 'todas' || item.souMembro) && (!termo || item.equipe.nome.toLowerCase().includes(termo)),
    )
  })

  const temFiltro = computed(() => filtro.value !== 'todas' || !!busca.value.trim())

  function limparFiltros() {
    filtro.value = 'todas'
    busca.value = ''
  }

  return { carregar, carregando, erro, filtro, busca, total: computed(() => itens.value.length), filtrados, temFiltro, limparFiltros }
}
