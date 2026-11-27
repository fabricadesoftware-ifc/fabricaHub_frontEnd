import type { Usuario } from '@/utils/tipos'

/** Id do usuário logado nos mocks (Jota). */
export const ID_USUARIO_LOGADO = 1

export const usuarios: Usuario[] = [
  { id: 1, nome: 'Jota', funcao: 'Front-end', isSuper: false, online: true, cor: '#12B0AE' },
  { id: 2, nome: 'Daniel', funcao: 'Back-end', isSuper: false, online: true, cor: '#2A2AFF' },
  { id: 3, nome: 'Peraza', funcao: 'Coordenação', isSuper: true, online: true, cor: '#FF2020' },
  { id: 4, nome: 'Zenere', funcao: 'Orientador', isSuper: false, online: false, cor: '#12B0AE' },
  { id: 5, nome: 'Andre', funcao: 'Design', isSuper: false, online: true, cor: '#FF6600' },
  { id: 6, nome: 'Igor', funcao: 'Mobile', isSuper: false, online: false, cor: '#2A2AFF' },
  { id: 7, nome: 'Pedro', funcao: 'Back-end', isSuper: false, online: true, cor: '#FF6600' },
  { id: 8, nome: 'Gabriel', funcao: 'DevOps', isSuper: false, online: false, cor: '#9AABFF' },
]
