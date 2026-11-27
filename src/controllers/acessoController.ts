import { acessoRepository } from '@/repositories/acessoRepository'
import type { SolicitacaoAcesso } from '@/utils/tipos'

export const acessoController = {
  listarSolicitacoes(): Promise<SolicitacaoAcesso[]> {
    return acessoRepository.listarSolicitacoes()
  },
}
