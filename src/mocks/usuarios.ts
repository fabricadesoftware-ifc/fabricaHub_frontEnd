import type { Usuario } from '@/utils/tipos'

/** Id do usuário logado nos mocks (Jota). */
export const ID_USUARIO_LOGADO = 1

export const usuarios: Usuario[] = [
  { id: 1, nome: 'Jota', funcao: 'Front-end', isSuper: false, online: true },
  { id: 2, nome: 'Daniel', funcao: 'Back-end', isSuper: false, online: true },
  { id: 3, nome: 'Peraza', funcao: 'Coordenação', isSuper: true, online: false },
  { id: 4, nome: 'Zenere', funcao: 'Orientador', isSuper: false, online: false },
  { id: 5, nome: 'Andre', funcao: 'Design', isSuper: false, online: true },
  { id: 6, nome: 'Igor', funcao: 'Mobile', isSuper: false, online: false },
  { id: 7, nome: 'Pedro', funcao: 'Back-end', isSuper: false, online: true },
  { id: 8, nome: 'Gabriel', funcao: 'DevOps', isSuper: false, online: false },
]
