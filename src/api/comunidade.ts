import { atividades, equipes } from '@/mocks/comunidade'
import { respostaMock } from '@/utils/respostaMock'
import type { Atividade, Equipe } from '@/utils/tipos'

export const comunidadeApi = {
  // Futuro: client.get<Atividade[]>('/atividades')
  listarAtividades(): Promise<Atividade[]> {
    return respostaMock(atividades)
  },

  // Futuro: client.get<Equipe[]>('/equipes')
  listarEquipes(): Promise<Equipe[]> {
    return respostaMock(equipes)
  },
}
