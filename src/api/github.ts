import { contasGitHub, LOGIN_AUTORIZADO, LOGIN_NAO_AUTORIZADO } from '@/mocks/github'
import { respostaMock } from '@/utils/respostaMock'
import type { ContaGitHub } from '@/utils/tipos'

export const githubApi = {
  /**
   * Futuro: troca do código OAuth do GitHub por sessão (client.post('/auth/github')).
   * No mock, `simularSemAcesso` escolhe a conta sem acesso (seletor de papel em dev).
   */
  autenticar(simularSemAcesso = false): Promise<ContaGitHub> {
    const login = simularSemAcesso ? LOGIN_NAO_AUTORIZADO : LOGIN_AUTORIZADO
    const conta = contasGitHub.find((c) => c.login === login) ?? contasGitHub[0]!
    return respostaMock(conta)
  },
}
