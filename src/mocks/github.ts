import type { ContaGitHub } from '@/utils/tipos'

/** Login padrão do mock: conta autorizada, ligada ao usuário Jota. */
export const LOGIN_AUTORIZADO = 'jota'
/** Conta sem acesso, usada pelo seletor de papel na opção "não autorizado". */
export const LOGIN_NAO_AUTORIZADO = 'igor.dev'

export const contasGitHub: ContaGitHub[] = [
  { login: 'jota', nome: 'Jota', iniciais: 'J', idUsuario: 1 },
  { login: 'igor.dev', nome: 'Igor', iniciais: 'IG', idUsuario: null },
]
