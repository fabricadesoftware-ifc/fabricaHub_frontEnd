import type { Tarefa } from '@/utils/tipos'

export const tarefas: Tarefa[] = [
  { id: 101, titulo: 'Endpoint de notas finais', idProjeto: 1, branch: 'feat/notas-finais', prioridade: 'Alta', idResponsavel: 1, status: 'Fazendo' },
  { id: 102, titulo: 'Tela de importação de planilhas', idProjeto: 1, branch: 'feat/importar-planilha', prioridade: 'Média', idResponsavel: 1, status: 'A fazer' },
  { id: 103, titulo: 'Autenticação com SUAP', idProjeto: 1, branch: 'feat/login-suap', prioridade: 'Alta', idResponsavel: 2, status: 'Em revisão' },
  { id: 104, titulo: 'Protótipo do painel de turmas', idProjeto: 1, branch: 'design/painel-turmas', prioridade: 'Baixa', idResponsavel: 5, status: 'Concluída' },
  { id: 201, titulo: 'Galeria de lâminas com zoom', idProjeto: 2, branch: 'feat/zoom-laminas', prioridade: 'Média', idResponsavel: 1, status: 'Fazendo' },
  { id: 202, titulo: 'API de quiz por tecido', idProjeto: 2, branch: 'feat/quiz-tecidos', prioridade: 'Alta', idResponsavel: 2, status: 'Em revisão' },
  { id: 301, titulo: 'Tokens de design e sidebar', idProjeto: 3, branch: 'feat/layout-base', prioridade: 'Alta', idResponsavel: 1, status: 'Fazendo' },
  { id: 302, titulo: 'Crachá com cor por papel', idProjeto: 3, branch: 'feat/cracha', prioridade: 'Média', idResponsavel: 1, status: 'A fazer' },
  { id: 303, titulo: 'Guard de rotas por papel', idProjeto: 3, branch: 'feat/guard-papel', prioridade: 'Baixa', idResponsavel: 1, status: 'A fazer' },
  { id: 304, titulo: 'Migrations de usuários e projetos', idProjeto: 3, branch: 'feat/migrations', prioridade: 'Alta', idResponsavel: 7, status: 'Em revisão' },
  { id: 305, titulo: 'Pipeline de deploy', idProjeto: 3, branch: 'ci/deploy', prioridade: 'Média', idResponsavel: 8, status: 'Em revisão' },
  { id: 401, titulo: 'Leitor RFID no portão', idProjeto: 4, branch: 'feat/rfid', prioridade: 'Média', idResponsavel: 6, status: 'A fazer' },
  { id: 501, titulo: 'Mapa de pontos de coleta', idProjeto: 5, branch: 'feat/mapa-coleta', prioridade: 'Alta', idResponsavel: 7, status: 'Fazendo' },
  { id: 601, titulo: 'Página de projetos', idProjeto: 6, branch: 'feat/pagina-projetos', prioridade: 'Baixa', idResponsavel: 8, status: 'Concluída' },
]
