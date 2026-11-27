import { diaDaSemana } from '@/utils/datas'
import type { EventoAgenda } from '@/utils/tipos'

// Datas relativas à segunda desta semana (0 = segunda ... 4 = sexta).
// Prazos de tarefas entram na agenda automaticamente (ver api/agenda.ts).
export const eventos: EventoAgenda[] = [
  { id: 1, titulo: 'Upload das imagens', data: diaDaSemana(0), idProjeto: 2, tipo: 'entrega', concluido: true },
  { id: 2, titulo: 'PR do filtro de equipes', data: diaDaSemana(1), idProjeto: 1, tipo: 'entrega', concluido: true },
  { id: 3, titulo: 'Sprint review', data: diaDaSemana(2), hora: '14h', tipo: 'reuniao' },
  { id: 4, titulo: 'Reunião Front-end', data: diaDaSemana(4), hora: '10h', tipo: 'reuniao' },
  { id: 5, titulo: 'Workshop de Django REST', data: diaDaSemana(4), hora: '14h', local: 'Laboratório 3', tipo: 'evento' },
  // Eventos da Fábrica com data marcada (aparecem na agenda das Notícias)
  { id: 6, titulo: 'Apresentação dos projetos', data: '2026-12-04', hora: '19h', local: 'Auditório', tipo: 'evento' },
  { id: 7, titulo: 'Encerramento do semestre', data: '2026-12-11', hora: '18h', local: 'Fábrica', tipo: 'evento' },
]
