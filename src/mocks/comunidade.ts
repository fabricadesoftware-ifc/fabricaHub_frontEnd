import type { Atividade, ProjetoEquipe, TimeMembro } from '@/utils/tipos'

export const atividades: Atividade[] = [
  { id: 1, idAutor: 2, acao: 'comentou em', alvo: 'Ajustar filtro de equipes', idTarefa: 15, haQuantoTempo: 'há 12 min' },
  { id: 2, idAutor: 3, acao: 'te marcou em', alvo: 'Criar tela de login', idTarefa: 14, haQuantoTempo: 'há 1 h' },
  { id: 3, idAutor: 5, acao: 'entrou na equipe', alvo: 'Front-end', haQuantoTempo: 'ontem' },
]

/** Equipes sem os membros: quem está em cada uma vem de `timeMembros` (tabela Time_Membro). */
export interface EquipeMock {
  id: number
  nome: string
  cor: string
  desde: string
  projetos: ProjetoEquipe[]
}

export const equipes: EquipeMock[] = [
  {
    id: 1,
    nome: 'Front-end',
    cor: '#FF6600',
    desde: '2025-03-03',
    projetos: [
      { idProjeto: 1, inicio: '2025-03-03' },
      { idProjeto: 3, inicio: '2025-10-06' },
      { idProjeto: 6, inicio: '2025-03-03', fim: '2025-06-30' },
    ],
  },
  {
    id: 2,
    nome: 'Back-end',
    cor: '#2A2AFF',
    desde: '2025-03-03',
    projetos: [
      { idProjeto: 1, inicio: '2025-03-03' },
      { idProjeto: 4, inicio: '2025-05-05' },
      { idProjeto: 3, inicio: '2025-10-06' },
    ],
  },
  {
    id: 3,
    nome: 'Design',
    cor: '#12B0AE',
    desde: '2025-05-05',
    projetos: [
      { idProjeto: 2, inicio: '2025-05-05' },
      { idProjeto: 1, inicio: '2025-05-05' },
      { idProjeto: 6, inicio: '2025-05-05', fim: '2025-06-30' },
    ],
  },
]

export const timeMembros: TimeMembro[] = [
  // Front-end
  { id: 1, idEquipe: 1, idUsuario: 1, inicio: '2025-03-03' },
  { id: 2, idEquipe: 1, idUsuario: 7, inicio: '2025-03-03' },
  { id: 3, idEquipe: 1, idUsuario: 3, inicio: '2025-04-07' },
  { id: 4, idEquipe: 1, idUsuario: 5, inicio: '2025-11-03' },
  { id: 5, idEquipe: 1, idUsuario: 8, inicio: '2025-03-03' },
  { id: 6, idEquipe: 1, idUsuario: 2, inicio: '2025-02-10', fim: '2025-06-30' },
  { id: 7, idEquipe: 1, idUsuario: 6, inicio: '2025-03-03', fim: '2025-08-01' },
  // Back-end
  { id: 8, idEquipe: 2, idUsuario: 2, inicio: '2025-03-03' },
  { id: 9, idEquipe: 2, idUsuario: 7, inicio: '2025-03-03' },
  { id: 10, idEquipe: 2, idUsuario: 6, inicio: '2025-05-05' },
  { id: 11, idEquipe: 2, idUsuario: 8, inicio: '2025-03-03', fim: '2025-09-30' },
  // Design
  { id: 12, idEquipe: 3, idUsuario: 1, inicio: '2025-05-05' },
  { id: 13, idEquipe: 3, idUsuario: 5, inicio: '2025-11-03' },
  { id: 14, idEquipe: 3, idUsuario: 4, inicio: '2025-05-05' },
]
