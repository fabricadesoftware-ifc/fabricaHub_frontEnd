import { tarefasEmMemoria } from '@/api/tarefas'
import { eventos } from '@/mocks/agenda'
import { respostaMock } from '@/utils/respostaMock'
import type { EventoAgenda } from '@/utils/tipos'

export const agendaApi = {
  /**
   * Eventos entre `inicio` e `fim` (ISO 'YYYY-MM-DD', inclusive),
   * mais os prazos das tarefas abertas do usuário.
   */
  // Futuro: client.get<EventoAgenda[]>('/agenda', { params: { inicio, fim } })
  listar(idUsuario: number, inicio: string, fim: string): Promise<EventoAgenda[]> {
    const prazos: EventoAgenda[] = tarefasEmMemoria()
      .filter((t) => t.idResponsavel === idUsuario && t.prazo && t.status !== 'Concluída')
      .map((t) => ({ id: 1000 + t.id, titulo: t.titulo, data: t.prazo!, idProjeto: t.idProjeto, tipo: 'entrega' }))
    const lista = [...eventos, ...prazos].filter((e) => e.data >= inicio && e.data <= fim)
    return respostaMock(lista)
  },

  /** Próximos eventos da Fábrica (a partir de `desde`, ISO), do mais perto ao mais longe. */
  // Futuro: client.get<EventoAgenda[]>('/agenda/eventos', { params: { desde, limite } })
  listarProximosEventos(desde: string, limite = 3): Promise<EventoAgenda[]> {
    const lista = eventos
      .filter((e) => e.tipo === 'evento' && e.data >= desde)
      .sort((a, b) => a.data.localeCompare(b.data))
      .slice(0, limite)
    return respostaMock(lista)
  },
}
