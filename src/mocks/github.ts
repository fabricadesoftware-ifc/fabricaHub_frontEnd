import { diaRelativo } from '@/utils/datas'
import type { AtividadeGithub, ContaGitHub, PerfilDev } from '@/utils/tipos'

export const contasGitHub: ContaGitHub[] = [
  { login: 'jota', nome: 'Jota', iniciais: 'J', idUsuario: 1 },
  { login: 'daniel', nome: 'Daniel', iniciais: 'DA', idUsuario: 2 },
  { login: 'peraza', nome: 'Peraza', iniciais: 'PE', idUsuario: 3 },
  { login: 'igor.dev', nome: 'Igor', iniciais: 'IG', idUsuario: null },
]

/**
 * Qual conta "entra" em cada perfil do seletor de papel (só em desenvolvimento).
 * Membro = Jota · Líder = Daniel (lidera Painel e Histologia) · Admin = Peraza (isSuper).
 */
export const LOGIN_POR_PERFIL: Record<PerfilDev, string> = {
  membro: 'jota',
  lider: 'daniel',
  admin: 'peraza',
  'nao-autorizado': 'igor.dev',
}

const MESES = ['JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV']

/** Atividade pública na organização do GitHub, por id de usuário. */
export const atividadesGithub: Record<number, AtividadeGithub> = {
  1: {
    commits: 76,
    pullRequests: 31,
    ultimaAtividade: diaRelativo(0),
    commitsPorMes: [4, 9, 12, 15, 17, 19].map((total, i) => ({ mes: MESES[i]!, total })),
    prsRecentes: [
      { repositorio: 'fabricaHub_frontEnd', numero: 18, titulo: 'Dashboard do membro', data: diaRelativo(-1) },
      { repositorio: 'painel-integracao_frontEnd', numero: 52, titulo: 'Tela de boletim', data: diaRelativo(-3) },
      { repositorio: 'fabricaHub_frontEnd', numero: 15, titulo: 'Quadro de tarefas', data: diaRelativo(-6) },
    ],
  },
  2: {
    commits: 98,
    pullRequests: 52,
    ultimaAtividade: diaRelativo(-1),
    commitsPorMes: [8, 12, 18, 21, 16, 23].map((total, i) => ({ mes: MESES[i]!, total })),
    prsRecentes: [
      { repositorio: 'painel-integracao_backEnd', numero: 48, titulo: 'Endpoint de notas finais', data: diaRelativo(-1) },
      { repositorio: 'histologia_api', numero: 31, titulo: 'Upload de lâminas em lote', data: diaRelativo(-3) },
      { repositorio: 'painel-integracao_backEnd', numero: 47, titulo: 'Filtro de equipes por curso', data: diaRelativo(-6) },
      { repositorio: 'histologia_api', numero: 30, titulo: 'Corrige paginação do atlas', data: diaRelativo(-9) },
      { repositorio: 'fabricaHub_backEnd', numero: 12, titulo: 'Modelo de Projeto_Membro', data: diaRelativo(-13) },
    ],
  },
}

/** Quem não tem dados próprios no mock recebe uma atividade menor e genérica. */
export function atividadeGenerica(idUsuario: number): AtividadeGithub {
  const base = (idUsuario % 5) + 2
  return {
    commits: base * 9,
    pullRequests: base * 3,
    ultimaAtividade: diaRelativo(-base),
    commitsPorMes: MESES.map((mes, i) => ({ mes, total: base + ((i * idUsuario) % 7) })),
    prsRecentes: [
      { repositorio: 'fabricaHub_backEnd', numero: 10 + base, titulo: 'Ajustes de documentação', data: diaRelativo(-base) },
      { repositorio: 'site-fabrica', numero: 20 + base, titulo: 'Corrige links quebrados', data: diaRelativo(-base - 4) },
    ],
  }
}
