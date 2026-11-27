import { tarefas } from '@/mocks/tarefas'
import { respostaMock } from '@/utils/respostaMock'
import type { Tarefa } from '@/utils/tipos'

export const tarefasApi = {
  // Futuro: client.get<Tarefa[]>('/tarefas')
  listar(): Promise<Tarefa[]> {
    return respostaMock(tarefas)
  },
}
