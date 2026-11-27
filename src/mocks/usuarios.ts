import type { Usuario } from '@/utils/tipos'

/** Id do usuário logado nos mocks (Jota). */
export const ID_USUARIO_LOGADO = 1

export const usuarios: Usuario[] = [
  { id: 1, nome: 'Jota', funcao: 'Front-end', matricula: 42, isSuper: false, online: true },
  { id: 2, nome: 'Daniel', funcao: 'Back-end', matricula: 17, isSuper: false, online: true },
  { id: 3, nome: 'Peraza', funcao: 'Coordenação', matricula: 1, isSuper: true, online: false },
  { id: 4, nome: 'Zenere', funcao: 'Orientador', matricula: 2, isSuper: false, online: false },
  { id: 5, nome: 'Andre', funcao: 'Design', matricula: 23, isSuper: false, online: true },
  { id: 6, nome: 'Igor', funcao: 'Mobile', matricula: 31, isSuper: false, online: false },
  { id: 7, nome: 'Pedro', funcao: 'Back-end', matricula: 38, isSuper: false, online: true },
  { id: 8, nome: 'Gabriel', funcao: 'DevOps', matricula: 45, isSuper: false, online: false },
]
