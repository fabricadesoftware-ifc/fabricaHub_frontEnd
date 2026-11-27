import { tarefaRepository } from '@/repositories/tarefaRepository'
import type { Tarefa } from '@/utils/tipos'

export const tarefaController = {
  listar(): Promise<Tarefa[]> {
    return tarefaRepository.listar()
  },
}
