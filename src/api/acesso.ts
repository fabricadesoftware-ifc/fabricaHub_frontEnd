import { solicitacoesAcesso as solicitacoesMock } from '@/mocks/acessos'
import { respostaMock } from '@/utils/respostaMock'
import type { GithubUser, SolicitacaoAcesso } from '@/utils/tipos'

import { ref, toRaw } from 'vue'
import { lerJson, salvarJson } from '@/utils/armazenamento'
import { autorizarConta } from './usuarios'
import { registrar } from './auditoria'
const chave = 'fabricahub:pedidos'
export const pedidosAcesso = ref<SolicitacaoAcesso[]>(lerJson(chave) ?? structuredClone(solicitacoesMock))
const solicitacoes = pedidosAcesso.value
export function decidirPedido(id: number, aprovar: boolean, autor: string) {
  const pedido = solicitacoes.find(p => p.id === id && p.pendente)
  if (!pedido) throw new Error('Este pedido já foi analisado.')
  if (aprovar && !pedido.loginGitHub) throw new Error('Este pedido não possui conta GitHub vinculada.')
  if (aprovar && pedido.loginGitHub) autorizarConta({ login: pedido.loginGitHub, nome: pedido.nome, iniciais: pedido.nome.slice(0, 2).toUpperCase() })
  pedido.pendente = false
  salvarJson(chave, solicitacoes)
  registrar(autor, (aprovar ? 'Autorizou ' : 'Recusou ') + pedido.nome + ' (pedido nº ' + id + ').', 'Acesso')
}

export const acessoApi = {
  // Futuro: client.get<SolicitacaoAcesso[]>('/admin/acessos')
  listarSolicitacoes(): Promise<SolicitacaoAcesso[]> {
    return respostaMock(toRaw(solicitacoes))
  },

  // Futuro: client.post<SolicitacaoAcesso>('/acessos', { login })
  criarPedido(githubUser: GithubUser): Promise<SolicitacaoAcesso> {
    const existente = solicitacoes.find((s) => s.loginGitHub === githubUser.login && s.pendente)
    if (existente) return respostaMock(toRaw(existente))
    const pedido: SolicitacaoAcesso = {
      id: Math.max(0, ...solicitacoes.map((s) => s.id)) + 1,
      nome: githubUser.nome,
      tag: 'membro',
      pendente: true,
      loginGitHub: githubUser.login,
    }
    solicitacoes.push(pedido)
    salvarJson(chave, solicitacoes)
    registrar(githubUser.login, 'Solicitou acesso.', 'Acesso')
    return respostaMock(pedido)
  },
}
