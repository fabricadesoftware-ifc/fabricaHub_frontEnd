import { discussaoApi, registrarHistorico } from '@/api/discussao'
import { tarefas as tarefasMock } from '@/mocks/tarefas'
import { respostaMock } from '@/utils/respostaMock'
import type { DecisaoRevisao, NovaTarefa, StatusTarefa, Tarefa, TamanhoTarefa } from '@/utils/tipos'

import { registrar } from './auditoria'
import { usuarios } from './usuarios'

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

/** Horas previstas por tamanho (o líder pode ajustar depois). */
const HORAS: Record<TamanhoTarefa, number> = { P: 2, M: 4, G: 8 }

function aplicarStatus(tarefa: Tarefa, status: StatusTarefa) {
  tarefa.status = status
  if (status === 'Concluída') tarefa.aprovadaEm = new Date().toISOString()
  if (status === 'Em revisão') {
    tarefa.entregas = (tarefa.entregas ?? 0) + 1
    tarefa.enviadaEm = new Date().toISOString()
  }
}

function auditarTarefa(idAutor: number, acao: string) {
  registrar(usuarios.find(u=>u.id===idAutor)?.usuario ?? String(idAutor), acao, 'Tarefa')
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
    aplicarStatus(tarefa, status)
    registrarHistorico(id, status, idAutor, ACOES[status])
    auditarTarefa(idAutor, tarefa.titulo + ' → ' + status)
    return respostaMock(tarefa)
  },

  /** Nova tarefa do líder: entra em "A fazer". */
  // Futuro: client.post<Tarefa>('/tarefas', dados)
  criar(dados: NovaTarefa, idCriador: number): Promise<Tarefa> {
    const nova: Tarefa = {
      ...structuredClone(dados),
      id: tarefasApi.proximoId(),
      status: 'A fazer',
      previsaoHoras: HORAS[dados.tamanho],
      tipo: dados.branch.startsWith('fix/') ? 'Bug' : 'Feature',
      tags: [],
      idCriador,
      criadaEm: new Date().toISOString(),
    }
    tarefas.push(nova)
    auditarTarefa(idCriador, 'Criou a tarefa ' + nova.titulo + '.')
    registrarHistorico(nova.id, 'A fazer', idCriador, 'criou a tarefa')
    return respostaMock(nova)
  },

  /** Número que a próxima tarefa vai receber (aparece na prévia do formulário). */
  proximoId(): number {
    return Math.max(0, ...tarefas.map((t) => t.id)) + 1
  },

  /**
   * Revisão do líder: aprovar conclui; devolver volta para "Fazendo" com o comentário
   * registrado na discussão da tarefa (obrigatório para devolver).
   */
  // Futuro: client.post<Tarefa>(`/tarefas/${id}/revisao`, { decisao, comentario })
  async revisar(id: number, decisao: DecisaoRevisao, idAutor: number, comentario: string): Promise<Tarefa> {
    const tarefa = tarefas.find((t) => t.id === id)
    if (!tarefa) throw new Error(`Tarefa ${id} não encontrada`)
    if (tarefa.status !== 'Em revisão') throw new Error('A tarefa não está em revisão')
    if (decisao === 'devolver' && !comentario.trim()) throw new Error('Comentário obrigatório para devolver')
    aplicarStatus(tarefa, decisao === 'aprovar' ? 'Concluída' : 'Fazendo')
    registrarHistorico(id, tarefa.status, idAutor, decisao === 'aprovar' ? 'aprovou a entrega' : 'devolveu para ajustes')
    auditarTarefa(idAutor, (decisao === 'aprovar' ? 'Aprovou ' : 'Devolveu ') + tarefa.titulo + '.')
    if (comentario.trim()) await discussaoApi.comentar(id, idAutor, comentario.trim())
    return respostaMock(tarefa)
  },
}
