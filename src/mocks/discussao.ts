import { diasAtras } from '@/utils/datas'
import type { ComentarioTarefa, HistoricoTarefa } from '@/utils/tipos'

export const comentarios: ComentarioTarefa[] = [
  { id: 1, idTarefa: 14, idAutor: 3, texto: 'A tela ficou ótima, só ajustar o espaço do botão no celular.', em: diasAtras(1, '14:40') },
  { id: 2, idTarefa: 14, idAutor: 1, texto: 'Ajustei o espaçamento, sobe no próximo commit.', em: diasAtras(1, '17:05') },
  { id: 3, idTarefa: 15, idAutor: 2, texto: 'Testei aqui e o filtro limpa certinho agora.', em: diasAtras(0, '09:10') },
]

/** Histórico de status. Tarefas sem entrada aqui ganham só o "criou a tarefa" (feito pela api). */
export const historico: HistoricoTarefa[] = [
  { id: 1, idTarefa: 14, status: 'A fazer', idAutor: 3, acao: 'criou a tarefa', em: diasAtras(9, '10:12') },
  { id: 2, idTarefa: 14, status: 'Fazendo', idAutor: 1, acao: 'começou a tarefa', em: diasAtras(3, '14:30') },
  { id: 3, idTarefa: 15, status: 'A fazer', idAutor: 2, acao: 'criou a tarefa', em: diasAtras(7, '14:00') },
  { id: 4, idTarefa: 15, status: 'Fazendo', idAutor: 1, acao: 'começou a tarefa', em: diasAtras(4, '09:00') },
  { id: 5, idTarefa: 15, status: 'Em revisão', idAutor: 1, acao: 'enviou para revisão', em: diasAtras(1, '16:20') },
  { id: 6, idTarefa: 17, status: 'A fazer', idAutor: 2, acao: 'criou a tarefa', em: diasAtras(14, '09:00') },
  { id: 7, idTarefa: 17, status: 'Fazendo', idAutor: 1, acao: 'começou a tarefa', em: diasAtras(10, '10:00') },
  { id: 8, idTarefa: 17, status: 'Em revisão', idAutor: 1, acao: 'enviou para revisão', em: diasAtras(7, '18:00') },
  { id: 9, idTarefa: 17, status: 'Concluída', idAutor: 2, acao: 'aprovou a tarefa', em: diasAtras(5, '17:10') },
]
