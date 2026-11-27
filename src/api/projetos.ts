import { projetos } from '@/mocks/projetos'
import { respostaMock } from '@/utils/respostaMock'
import type { Projeto } from '@/utils/tipos'

export const projetosApi = {
  // Futuro: client.get<Projeto[]>('/projetos')
  listar(): Promise<Projeto[]> {
    return respostaMock(projetos)
  },
}
