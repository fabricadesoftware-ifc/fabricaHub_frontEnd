import { ID_USUARIO_LOGADO, usuarios as usuariosMock } from '@/mocks/usuarios'
import { respostaMock } from '@/utils/respostaMock'
import type { Usuario } from '@/utils/tipos'

// Estado em memória que substitui a API enquanto ela não existe.
const usuarios: Usuario[] = structuredClone(usuariosMock)

function buscarPorId(id: number): Usuario {
  const usuario = usuarios.find((u) => u.id === id)
  if (!usuario) throw new Error(`Usuário ${id} não encontrado`)
  return usuario
}

export const usuariosApi = {
  // Futuro: client.get<Usuario>(`/usuarios/${id}`)
  obterPorId(id: number = ID_USUARIO_LOGADO): Promise<Usuario> {
    return respostaMock(buscarPorId(id))
  },

  // Futuro: client.get<Usuario[]>('/usuarios')
  listar(): Promise<Usuario[]> {
    return respostaMock(usuarios)
  },

  /** Só para o seletor de papel em desenvolvimento. */
  definirSuper(id: number, isSuper: boolean): Promise<Usuario> {
    const usuario = buscarPorId(id)
    usuario.isSuper = isSuper
    return respostaMock(usuario)
  },
}
