import { comentarios as comentariosMock, historico as historicoMock } from '@/mocks/discussao'
import { tarefas as tarefasMock } from '@/mocks/tarefas'
import { respostaMock } from '@/utils/respostaMock'
import type { ComentarioTarefa, HistoricoTarefa, StatusTarefa } from '@/utils/tipos'

const comentarios: ComentarioTarefa[] = structuredClone(comentariosMock)
const historico: HistoricoTarefa[] = structuredClone(historicoMock)

function proximoId(lista: { id: number }[]) {
  return Math.max(0, ...lista.map((item) => item.id)) + 1
}

/** Usado por `tarefasApi.atualizarStatus` para registrar a mudança. */
export function registrarHistorico(idTarefa: number, status: StatusTarefa, idAutor: number, acao: string) {
  historico.push({ id: proximoId(historico), idTarefa, status, idAutor, acao, em: new Date().toISOString() })
}

/** Ações que contam como revisão do líder. */
export const ACOES_REVISAO = ['aprovou a entrega', 'devolveu para ajustes']

export const discussaoApi = {
  /** Quantas revisões (aprovar ou devolver) a pessoa fez hoje. */
  // Futuro: client.get<number>('/revisoes/hoje')
  contarRevisoesDeHoje(idAutor: number): Promise<number> {
    const hoje = new Date().toDateString()
    const total = historico.filter(
      (h) => h.idAutor === idAutor && ACOES_REVISAO.includes(h.acao) && new Date(h.em).toDateString() === hoje,
    ).length
    return respostaMock(total)
  },

  // Futuro: client.get<ComentarioTarefa[]>(`/tarefas/${idTarefa}/comentarios`)
  listarComentarios(idTarefa: number): Promise<ComentarioTarefa[]> {
    return respostaMock(comentarios.filter((c) => c.idTarefa === idTarefa))
  },

  // Futuro: client.post<ComentarioTarefa>(`/tarefas/${idTarefa}/comentarios`, { texto })
  comentar(idTarefa: number, idAutor: number, texto: string): Promise<ComentarioTarefa> {
    const novo: ComentarioTarefa = { id: proximoId(comentarios), idTarefa, idAutor, texto, em: new Date().toISOString() }
    comentarios.push(novo)
    return respostaMock(novo)
  },

  /** Mais recente primeiro. Sem registros, devolve só a criação da tarefa. */
  // Futuro: client.get<HistoricoTarefa[]>(`/tarefas/${idTarefa}/historico`)
  listarHistorico(idTarefa: number): Promise<HistoricoTarefa[]> {
    let lista = historico.filter((h) => h.idTarefa === idTarefa)
    if (!lista.length) {
      const tarefa = tarefasMock.find((t) => t.id === idTarefa)
      if (tarefa) {
        lista = [{ id: 0, idTarefa, status: 'A fazer', idAutor: tarefa.idCriador, acao: 'criou a tarefa', em: tarefa.criadaEm }]
      }
    }
    return respostaMock([...lista].sort((a, b) => b.em.localeCompare(a.em)))
  },
}
