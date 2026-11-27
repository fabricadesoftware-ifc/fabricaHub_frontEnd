import { computed, ref } from 'vue'
import { agendaApi } from '@/api/agenda'
import { estadoDasFontes, useLista } from '@/composables/useLista'
import { useNoticias } from '@/composables/useNoticias'
import { isoDia } from '@/utils/datas'
import type { CategoriaNoticia } from '@/utils/tipos'

export const CATEGORIAS: CategoriaNoticia[] = ['Evento', 'Aviso', 'Projeto', 'Equipe']

/** Jornal da Fábrica: primeira página, últimas, agenda e mais lidas, com filtro de categoria e busca. */
export function useJornal() {
  const noticiasFonte = useNoticias()
  const agendaFonte = useLista(() => agendaApi.listarProximosEventos(isoDia(new Date()), 3), 'Não foi possível carregar a agenda.')
  const { carregando, erro } = estadoDasFontes([noticiasFonte, agendaFonte])

  const categoria = ref<CategoriaNoticia | null>(null)
  const busca = ref('')

  async function carregar() {
    await Promise.all([noticiasFonte.carregar(), agendaFonte.carregar()])
  }

  const filtradas = computed(() => {
    const termo = busca.value.trim().toLowerCase()
    return noticiasFonte.noticias.value.filter(
      (n) =>
        (!categoria.value || n.categoria === categoria.value) &&
        (!termo || `${n.titulo} ${n.resumo}`.toLowerCase().includes(termo)),
    )
  })

  /** Primeira página: a notícia marcada como destaque, se passar nos filtros. */
  const destaque = computed(() => filtradas.value.find((n) => n.destaque) ?? null)
  const ultimas = computed(() => filtradas.value.filter((n) => n.id !== destaque.value?.id))
  const maisLidas = computed(() => [...noticiasFonte.noticias.value].sort((a, b) => b.leituras - a.leituras).slice(0, 4))
  const temFiltro = computed(() => !!categoria.value || !!busca.value.trim())

  function limparFiltros() {
    categoria.value = null
    busca.value = ''
  }

  return {
    carregar,
    carregando,
    erro,
    categoria,
    busca,
    destaque,
    ultimas,
    maisLidas,
    agenda: agendaFonte.dados,
    temFiltro,
    limparFiltros,
  }
}
