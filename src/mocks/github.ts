import type { ContaGitHub, PerfilDev } from '@/utils/tipos'

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
