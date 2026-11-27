import { ID_USUARIO_LOGADO, usuarios } from '@/mocks/usuarios'
import { respostaMock } from '@/utils/respostaMock'
import type { Usuario } from '@/utils/tipos'

export const usuariosApi = {
  // Futuro: client.get<Usuario>(`/usuarios/${id}`)
  obterPorId(id: number = ID_USUARIO_LOGADO): Promise<Usuario> {
    const usuario = usuarios.find((u) => u.id === id)
    if (!usuario) return Promise.reject(new Error(`Usuário ${id} não encontrado`))
    return respostaMock(usuario)
  },

  // Futuro: client.get<Usuario[]>('/usuarios')
  listar(): Promise<Usuario[]> {
    return respostaMock(usuarios)
  },
}
