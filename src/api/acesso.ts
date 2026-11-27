import { solicitacoesAcesso as solicitacoesMock } from '@/mocks/acessos'
import { respostaMock } from '@/utils/respostaMock'
import type { GithubUser, SolicitacaoAcesso } from '@/utils/tipos'

const solicitacoes: SolicitacaoAcesso[] = structuredClone(solicitacoesMock)

export const acessoApi = {
  // Futuro: client.get<SolicitacaoAcesso[]>('/admin/acessos')
  listarSolicitacoes(): Promise<SolicitacaoAcesso[]> {
    return respostaMock(solicitacoes)
  },

  // Futuro: client.post<SolicitacaoAcesso>('/acessos', { login })
  criarPedido(githubUser: GithubUser): Promise<SolicitacaoAcesso> {
    const existente = solicitacoes.find((s) => s.loginGitHub === githubUser.login && s.pendente)
    if (existente) return respostaMock(existente)
    const pedido: SolicitacaoAcesso = {
      id: Math.max(0, ...solicitacoes.map((s) => s.id)) + 1,
      nome: githubUser.nome,
      tag: 'membro',
      pendente: true,
      loginGitHub: githubUser.login,
    }
    solicitacoes.push(pedido)
    return respostaMock(pedido)
  },
}
