import { comunidadeApi } from '@/api/comunidade'
import { useLista } from '@/composables/useLista'

export function useEquipes() {
  const { dados: equipes, carregando, erro, carregar } = useLista(
    () => comunidadeApi.listarEquipes(),
    'Não foi possível carregar as equipes.',
  )
  return { equipes, carregando, erro, carregar }
}
