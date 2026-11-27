import { tarefas } from '@/mocks/tarefas'
import { respostaMock } from '@/utils/respostaMock'
import type { Tarefa } from '@/utils/tipos'

export const tarefaRepository = {
  // Futuro: http.get<Tarefa[]>('/tarefas')
  listar(): Promise<Tarefa[]> {
    return respostaMock(tarefas)
  },
}
