import type { Atividade, Equipe } from '@/utils/tipos'

export const atividades: Atividade[] = [
  { id: 1, idAutor: 2, acao: 'comentou em', alvo: 'Ajustar filtro de equipes', idTarefa: 15, haQuantoTempo: 'há 12 min' },
  { id: 2, idAutor: 3, acao: 'te marcou em', alvo: 'Criar tela de login', idTarefa: 14, haQuantoTempo: 'há 1 h' },
  { id: 3, idAutor: 5, acao: 'entrou na equipe', alvo: 'Front-end', haQuantoTempo: 'ontem' },
]

export const equipes: Equipe[] = [
  { id: 1, nome: 'Front-end', idsMembros: [1, 2, 5, 6, 7, 8, 3, 4], idsProjetos: [1, 3] },
  { id: 2, nome: 'Design', idsMembros: [1, 5, 3, 4], idsProjetos: [1, 2, 6] },
  { id: 3, nome: 'Back-end', idsMembros: [2, 7, 8], idsProjetos: [1, 2, 3] },
]
