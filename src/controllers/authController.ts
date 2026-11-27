import { projetoRepository } from '@/repositories/projetoRepository'
import { usuarioRepository } from '@/repositories/usuarioRepository'
import type { Papel, Projeto, Usuario } from '@/utils/tipos'

export const authController = {
  obterUsuarioLogado(): Promise<Usuario> {
    return usuarioRepository.obterLogado()
  },

  /**
   * Só em desenvolvimento: muda o usuário mockado para simular um papel.
   * admin = isSuper; líder = Jota como idLead; membro = Jota sem liderar nada.
   */
  async simularPapel(idUsuario: number, papel: Papel): Promise<{ usuario: Usuario; projetos: Projeto[] }> {
    const usuario = await usuarioRepository.definirSuper(idUsuario, papel === 'admin')
    const projetos = await projetoRepository.definirLideranca(idUsuario, papel === 'lider')
    return { usuario, projetos }
  },
}
