import { solicitacoesAcesso } from '@/mocks/acessos'
import { respostaMock } from '@/utils/respostaMock'
import type { SolicitacaoAcesso } from '@/utils/tipos'

export const acessoRepository = {
  // Futuro: http.get<SolicitacaoAcesso[]>('/admin/acessos')
  listarSolicitacoes(): Promise<SolicitacaoAcesso[]> {
    return respostaMock(solicitacoesAcesso)
  },
}
