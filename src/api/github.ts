import { usuarios } from './usuarios'
import { registrar } from './auditoria'
import { contasGitHub, LOGIN_POR_PERFIL } from '@/mocks/github'
import { respostaMock } from '@/utils/respostaMock'
import type { ContaGitHub, PerfilDev } from '@/utils/tipos'

export const githubApi = {
  /**
   * Futuro: troca do código OAuth do GitHub por sessão (client.post('/auth/github')).
   * No mock, `perfil` escolhe qual conta entra (seletor de papel em dev).
   */
  autenticar(perfil: PerfilDev = 'membro'): Promise<ContaGitHub> {
    const conta = contasGitHub.find((c) => c.login === LOGIN_POR_PERFIL[perfil]) ?? contasGitHub[0]!
    const usuario = usuarios.find(u => conta.idUsuario !== null ? u.id === conta.idUsuario : u.usuario === conta.login)
    const idUsuario = usuario?.ativo ? usuario.id : null
    registrar(conta.login, idUsuario ? 'Entrou com o GitHub.' : 'Tentou entrar sem acesso autorizado.', 'Login', !!idUsuario)
    return respostaMock({ ...conta, idUsuario })
  },
}
