import { useLista } from '@/composables/useLista'
import { tarefasApi } from '@/api/tarefas'

export function useTarefas() {
  const { dados: tarefas, carregando, erro, carregar } = useLista(
    () => tarefasApi.listar(),
    'Não foi possível carregar as tarefas.',
  )
  return { tarefas, carregando, erro, carregar }
}
