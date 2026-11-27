import { useLista } from '@/composables/useLista'
import { mensagensApi } from '@/api/mensagens'

export function useMensagens() {
  const { dados: mensagens, carregando, erro, carregar } = useLista(
    () => mensagensApi.listar(),
    'Não foi possível carregar as mensagens.',
  )
  return { mensagens, carregando, erro, carregar }
}
