import { useLista } from '@/composables/useLista'
import { noticiasApi } from '@/api/noticias'

export function useNoticias() {
  const { dados: noticias, carregando, erro, carregar } = useLista(
    () => noticiasApi.listar(),
    'Não foi possível carregar as notícias.',
  )
  return { noticias, carregando, erro, carregar }
}
