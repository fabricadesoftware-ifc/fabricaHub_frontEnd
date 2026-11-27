import type { Prioridade, StatusTarefa, Tarefa } from '@/utils/tipos'

const ORDEM_STATUS: Record<StatusTarefa, number> = { Fazendo: 0, 'A fazer': 1, 'Em revisão': 2, Concluída: 3 }
const ORDEM_PRIORIDADE: Record<Prioridade, number> = { Alta: 0, Média: 1, Baixa: 2 }

/** Fazendo primeiro, depois A fazer, Em revisão e Concluída; dentro de cada um, prioridade mais alta antes. */
export function ordenarTarefas(a: Tarefa, b: Tarefa): number {
  return ORDEM_STATUS[a.status] - ORDEM_STATUS[b.status] || ORDEM_PRIORIDADE[a.prioridade] - ORDEM_PRIORIDADE[b.prioridade]
}

/** "G · 6h" */
export function esforco(tarefa: Tarefa): string {
  return `${tarefa.tamanho} · ${tarefa.previsaoHoras}h`
}
