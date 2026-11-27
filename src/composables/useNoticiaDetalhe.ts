import { computed, type Ref } from 'vue'
import { agendaApi } from '@/api/agenda'
import { noticiasApi } from '@/api/noticias'
import { estadoDasFontes, useDado, useLista } from '@/composables/useLista'
import { useNoticias } from '@/composables/useNoticias'
import { isoDia } from '@/utils/datas'
import { minutosDeLeitura } from '@/utils/noticias'

/** Notícia aberta, mais as outras notícias e os próximos eventos da agenda (coluna lateral). */
export function useNoticiaDetalhe(id: Ref<number>) {
  const noticiaFonte = useDado(() => noticiasApi.obter(id.value), 'Não foi possível carregar a notícia.')
  const noticiasFonte = useNoticias()
  const agendaFonte = useLista(() => agendaApi.listarProximosEventos(isoDia(new Date()), 2), 'Não foi possível carregar a agenda.')
  const { carregando, erro } = estadoDasFontes([noticiaFonte, noticiasFonte, agendaFonte])

  async function carregar() {
    await Promise.all([noticiaFonte.carregar(), noticiasFonte.carregar(), agendaFonte.carregar()])
    // Leitura é estatística: se falhar, a notícia continua aberta.
    if (noticiaFonte.dado.value) noticiasApi.registrarLeitura(id.value).catch(() => {})
  }

  const noticia = noticiaFonte.dado
  const naoEncontrada = computed(() => !carregando.value && !erro.value && !noticia.value)
  const minutos = computed(() => (noticia.value ? minutosDeLeitura(noticia.value) : 0))
  const outras = computed(() => noticiasFonte.noticias.value.filter((n) => n.id !== id.value).slice(0, 3))

  return { carregar, carregando, erro, naoEncontrada, noticia, minutos, outras, agenda: agendaFonte.dados }
}
