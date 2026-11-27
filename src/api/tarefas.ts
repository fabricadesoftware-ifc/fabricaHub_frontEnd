import { registrarHistorico } from '@/api/discussao'
import { tarefas as tarefasMock } from '@/mocks/tarefas'
import { respostaMock } from '@/utils/respostaMock'
import type { StatusTarefa, Tarefa } from '@/utils/tipos'

const tarefas: Tarefa[] = structuredClone(tarefasMock)

/** Estado atual das tarefas no mock, para outros módulos de `api/` (ex.: agenda). */
export function tarefasEmMemoria(): readonly Tarefa[] {
  return tarefas
}

const ACOES: Record<StatusTarefa, string> = {
  'A fazer': 'voltou a tarefa para A fazer',
  Fazendo: 'começou a tarefa',
  'Em revisão': 'enviou para revisão',
  Concluída: 'aprovou a tarefa',
}

export const tarefasApi = {
  // Futuro: client.get<Tarefa[]>('/tarefas')
  listar(): Promise<Tarefa[]> {
    return respostaMock(tarefas)
  },

  // Futuro: client.get<Tarefa>(`/tarefas/${id}`)
  obter(id: number): Promise<Tarefa | null> {
    return respostaMock(tarefas.find((t) => t.id === id) ?? null)
  },

  /** A permissão é conferida antes, no composable (ver utils/permissoes.ts). */
  // Futuro: client.patch<Tarefa>(`/tarefas/${id}`, { status })
  atualizarStatus(id: number, status: StatusTarefa, idAutor: number): Promise<Tarefa> {
    const tarefa = tarefas.find((t) => t.id === id)
    if (!tarefa) return Promise.reject(new Error(`Tarefa ${id} não encontrada`))
    tarefa.status = status
    if (status === 'Concluída') tarefa.aprovadaEm = new Date().toISOString()
    registrarHistorico(id, status, idAutor, ACOES[status])
    return respostaMock(tarefa)
  },
}
